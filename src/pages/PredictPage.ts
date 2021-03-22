import {NO_SHARE, ShareSetting, System} from "../lib/System.ts";
import {exchange, mIRT, uBTC} from "../lib/Coin.ts";
import {isSavePolicyInRange, SavePolicy, User} from "../lib/User.ts";
import {newWorkerFromProduct, Worker} from "../lib/Worker.ts";
import {errVal, print, toPrec} from "../util.ts";

export type {System};

const PREC = 100_000;

export const predict = (source_system: System, days: number = 30, timeShift: number = 0): System => {
  // const system = { ...source_system } as System;
  const system = JSON.parse(JSON.stringify(source_system)) as System;

  let lastBuy = Math.max(...system.workers.map((it) => it.startTime)) || 0;

  for (let i = 0; i < days; i++) {
	system.currentTime++;

	// holds income of current iteration
	const incomes: { [key: string]: number } = {};
	// fill each user profit to 0.0
	system.users.forEach((it) => incomes[it.id] = 0.0);
	//print(incomes);

	// calculate each active miner profit
	system.workers
	  .filter((it) => it.startTime < system.currentTime)
	  .filter((it) => it.endTime > system.currentTime)
	  .forEach((worker) => {
		// total mine income from current miner in a time period
		const worker_income = worker.coin.power_profit * worker.power *
		  worker.efficiency;
		//print({worker_income, owners: worker.owners});

		for (const owner_id in worker.owners) {
		  const owner_share = worker.owners[owner_id];
		  const owner_user = system.users.find((it) =>
			it.id == owner_id
		  ) as User;
		  if (!owner_user) continue;

		  // profit for this share
		  const share_profit = owner_share * worker_income;
		  let owner_profit = share_profit;

		  let shareSettings: ShareSetting[] = [];

		  shareSettings.push(owner_user.charityShare || system.charityShare || NO_SHARE);
		  shareSettings.push(owner_user.managerShare || system.managerShare || NO_SHARE);

		  if (owner_user.agentsShare)
			if (owner_user.agentsShare instanceof Array)
			  shareSettings.push(...owner_user.agentsShare);
			else
			  shareSettings.push(...[owner_user.agentsShare]);

		  shareSettings.forEach(shareSetting => {
			// share from this worker/owner profit
			let this_share = share_profit * shareSetting.share;
			// take this share from owner
			owner_profit = share_profit - this_share;

			if (this_share > 0) {
			  incomes[shareSetting.userId] += this_share;
			}
		  });

		  incomes[owner_id] += owner_profit;

		  //print({owner_id, share_profit, owner_profit, agent_profit});
		}
	  });

	//print(incomes);
	for (const user_id in incomes) {
	  const user = system.users.find((it) => it.id == user_id) as User || errVal(`no user with id "${user_id}"`);

	  const income = incomes[user_id];
	  let income_working = 0;
	  let income_saving = 0;

	  let savePolicy: SavePolicy | undefined = undefined;
	  if (user.savePolicy) {
		if (user.savePolicy instanceof Array) {
		  for (let i = 0; i < user.savePolicy.length; i++) {
			savePolicy = user.savePolicy[i];
			if (isSavePolicyInRange(savePolicy, system, timeShift)) break;
			else savePolicy = undefined;
		  }
		} else if (isSavePolicyInRange(user.savePolicy, system, timeShift)) {
		  savePolicy = user.savePolicy;
		}
	  }

	  if (savePolicy) {
		income_working = income;
		income_saving = income * savePolicy.rate;
		income_working -= income_saving;
	  } else {
		[income_saving, income_working] = [0, income];
	  }

	  user.wallet.working += income_working;
	  user.wallet.saving += income_saving;
	}

	// reinvest
	const product = system.products[0];
	const minBuyInterval = product.minBuyInterval;
	if (system.currentTime - lastBuy < minBuyInterval) {
	  continue;
	}
	const invest_wallet = system.users.map((it) => it.wallet.working).reduce((a, b) => a + b, 0.0);

	let productPrice = exchange(product.price, product.price_coin, uBTC);
	let new_miner_count = Math.floor(invest_wallet / productPrice);
	//print({ lastBuy, day:system.current_day,invest_wallet, new_miner_count });

	if (new_miner_count > 0 && (!product.minCount || new_miner_count >= product.minCount)) {
	  const order_price = new_miner_count * productPrice;
	  const price_ratio = order_price / invest_wallet;
	  const owner_share: { [_: string]: number } = {};

	  system.users.forEach((user) => {
		const share_price = (user.wallet.working * price_ratio);
		user.wallet.working -= share_price;
		owner_share[user.id] = Math.round(PREC * share_price / order_price) / PREC;
	  });

	  const owners = Object.fromEntries(
		Object.entries(owner_share).filter((it) => it[1] > 0),
	  );
	  const newWorker = newWorkerFromProduct({
		product,
		owners,
		start_day: system.currentTime,
		count: new_miner_count,
	  });
	  system.workers.push(newWorker);
	  lastBuy = system.currentTime;

	  //print({ lastBuy, owners, newWorker });
	}
  }

  return system;
};

export const showPredict = async () => {
  const baseSystem: System = JSON.parse(JSON.stringify((globalThis as any).system));
  const period = 30;

  let system: System = baseSystem;
  const startPredictDay = system.currentTime;

  console.clear();
  const periodPower = [];

  // @ts-ignore
  const silentPeriod = parseInt(prompt("Enter Num of Periods (or skip to see in details):"));
  const silent = silentPeriod > 0;

  for (let i = 0; /*i < 24 + 1*/; i++) {
	const lastPeriod = silent && silentPeriod < system.currentTime / period;

	let active_workers = system.workers
	  .filter((it) => it.endTime > system.currentTime)
	  .map((it) => ({
		start: it.startTime,
		end: it.endTime,
		power: it.power,
		owners: it.owners,
		productCount: it.purchase.productCount,
		allPrice: `${toPrec(it.purchase.sumPrice)} ${it.purchase.priceCoin.sign}`,
	  }));
	const count = active_workers.length;
	const sum_power = toPrec(active_workers.reduce((prev, el) => prev + el.power, 0));
	const sum_power_day = toPrec(active_workers.reduce((prev, el) => prev + el.power * (el.end - system.currentTime), 0));
	const sum_power_1m = toPrec(sum_power_day / (1 * 30));
	const sum_power_3m = toPrec(sum_power_day / (3 * 30));
	const sum_power_6m = toPrec(sum_power_day / (6 * 30));
	const sum_power_12m = toPrec(sum_power_day / (12 * 30));

	const workers = active_workers.map(it => ({
	  start: it.start,
	  end: it.end,
	  power: toPrec(it.power, 1),
	  productCount: toPrec(it.productCount, 1),
	  allPrice: it.allPrice,
	}));

	if (!silent || lastPeriod)
	  print({
		title: 'WORKERS', workers, count, sum_power,
		sum_power_day, sum_power_1m, sum_power_3m, sum_power_6m, sum_power_12m
	  });

	const all_report = system.users.map(it => ({
	  user: it.id,
	  'save uBTC': toPrec(it.wallet.saving),
	  'save mIRT': toPrec(exchange(it.wallet.saving, uBTC, mIRT)),
	  'work uBTC': toPrec(it.wallet.working),
	  'work mIRT': toPrec(exchange(it.wallet.working, uBTC, mIRT)),
	  'TH/s': toPrec(active_workers.reduce((prev, el) => prev + el.power * (el.owners[it.id] || 0), 0)),
	}));
	const report = all_report.filter(it => it['save uBTC'] > 0 || it['work uBTC'] > 0 || it['TH/s'] > 0);
	const sum = {
	  user: '--SUM--',
	  'save uBTC': toPrec(report.reduce((p, x) => p + x['save uBTC'], 0)),
	  'save mIRT': toPrec(report.reduce((p, x) => p + x['save mIRT'], 0)),
	  'work uBTC': toPrec(report.reduce((p, x) => p + x['work uBTC'], 0)),
	  'work mIRT': toPrec(report.reduce((p, x) => p + x['work mIRT'], 0)),
	  'TH/s': toPrec(report.reduce((p, x) => p + x['TH/s'], 0)),
	};
	if (report.length > 1) {
	  report.push({
		user: '-------',
		'save uBTC': '-------' as any as number,
		'save mIRT': '-------' as any as number,
		'work uBTC': '-------' as any as number,
		'work mIRT': '-------' as any as number,
		'TH/s': '-------' as any as number,
	  });
	  report.push(sum);
	}

	periodPower.push({
	  i, day: system.currentTime, save: sum["save mIRT"],
	  power: sum_power, sum_power_day,
	  sum_power_1m, sum_power_3m,
	  sum_power_6m, sum_power_12m,
	});

	if (!silent || lastPeriod) {
	  print('User States', {system_day: system.currentTime, predict_day: system.currentTime - startPredictDay});
	  console.table(report);
	}

	if (lastPeriod) break;

	// @ts-ignore
	if (!silent && (prompt("predict next period? (Y,n)") || "Y") == 'n') break;

	system = predict(system, period, -startPredictDay);
  }

  console.table(periodPower);
  // @ts-ignore
  alert("to exit PREDICT page press")
};
