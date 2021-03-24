import {NO_SHARE, ShareSetting, System} from "../lib/System.ts";
import {Coin, exchange, mIRT, uBTC, USDT} from "../lib/Coin.ts";
import {SavePolicy, User} from "../lib/User.ts";
import {Worker} from "../lib/Worker.ts";
import {errVal, print, StrDict, toPrec} from "../util.ts";
import {Source} from "../lib/Source.ts";
import {Wallet} from "../lib/Wallet.ts";
import {Product} from "../lib/Product.ts";

export type {System};

const PREC = 100_000;


export const predict = (source_system: System, days: number = 30, timeShift: number = 0): System => {
  const system = JSON.parse(JSON.stringify(source_system)) as System;
  let lastBuy = Math.max(...system.workers.map((it) => it.startTime)) || 0;

  // type Income = { all: number; working: number; saving: number; };
  // const BASE_INCOMES: StrDict<StrDict<StrDict<Income>>> = {};
  // system.sources.forEach(source => {
  // const sourceIncome: StrDict<StrDict<Income>> = {};
  // BASE_INCOMES[source.id] = sourceIncome;
  // system.coins.forEach(coin => {
  //   const coinIncome: StrDict<Income> = {};
  //   sourceIncome[coin.id] = coinIncome;
  //   system.users.forEach(user => {
  // 	const userIncome: Income = {all: 0, working: 0, saving: 0};
  // 	coinIncome[user.id] = userIncome;
  //   })
  // });
  // });


  for (let i = 0; i < days; i++) {
	system.currentTime++;

	// // holds income of current iteration
	// const incomes: StrDict<StrDict<StrDict<Income>>> = JSON.parse(JSON.stringify(BASE_INCOMES));

	// calculate each active miner profit
	system.workers
	  .filter((it) => it.startTime < system.currentTime)
	  .filter((it) => it.endTime > system.currentTime)
	  .forEach((worker) => {
		const mineCoin: Coin = Coin.findById(worker.coin, system) || errVal("worker coin-id is wrong");
		const mineSource: Source = Source.findById(worker.source, system) || errVal("worker source-id is wrong");

		// total mine income from current miner in a time period
		const worker_income = mineCoin.power_profit * worker.power * worker.efficiency;
		const liveWallet = Wallet.find({source: mineSource, coin: mineCoin, type: 'live'}, system)!;
		liveWallet.value += worker_income;

		const owners = worker.owners instanceof String ? {[worker.owners as string]: 1} : worker.owners;
		Object.entries(owners).forEach(([owner_id, owner_share]) => {

		  const owner_user = User.findById(owner_id, system);
		  if (!owner_user) return;

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

			if (this_share > 0) {
			  // take this share from owner
			  owner_profit -= this_share;

			  const shareWallet = Wallet.find({
				source: mineSource,
				coin: mineCoin,
				user: shareSetting.userId,
				type: 'income',
			  }, system)!;
			  shareWallet.value += this_share;
			}
		  });

		  if (owner_profit > 0) {
			const userWallet = Wallet.find({
			  source: mineSource,
			  coin: mineCoin,
			  user: owner_id,
			  type: 'income',
			}, system)!;
			userWallet.value += owner_profit;
		  }
		});
	  });

	system.sources.forEach(source => {
	  system.coins.forEach(coin => {
		system.users.forEach(user => {
		  const incomeWallet = Wallet.find({source, coin, user, type: 'income'}, system, false);
		  if (!incomeWallet || incomeWallet.value <= 0) return;

		  const workingWallet = Wallet.find({source, coin, user, type: 'working'}, system)!;
		  const savingWallet = Wallet.find({source, coin, user, type: 'saving'}, system)!;

		  let savePolicy: SavePolicy | undefined = undefined;
		  if (user.savePolicy) {
			if (user.savePolicy instanceof Array) {
			  for (let i = 0; i < user.savePolicy.length; i++) {
				savePolicy = user.savePolicy[i];
				if (User.isSavePolicyInRange(savePolicy, system, timeShift)) break;
				else savePolicy = undefined;
			  }
			} else if (User.isSavePolicyInRange(user.savePolicy, system, timeShift)) {
			  savePolicy = user.savePolicy;
			}
		  }

		  if (!source.reinvestProduct) {
			savingWallet.value += incomeWallet.value;
			incomeWallet.value = 0;
		  } else if (savePolicy) {
			const save = incomeWallet.value * savePolicy.rate;
			savingWallet.value += save;
			workingWallet.value += incomeWallet.value - save;
			incomeWallet.value = 0;
		  } else {
			workingWallet.value += incomeWallet.value;
			incomeWallet.value = 0;
		  }
		});
	  });
	});

	// reinvest
	system.sources.forEach(source => {
		system.coins.forEach(coin => {
		  const liveWallet = Wallet.find({source, coin, type: "live"}, system, false);
		  if (!liveWallet || liveWallet.value <= 0) return;
		  // const products = Product.findAll({company: source.company, mineCoin: coin}, system);

		  const product = source.reinvestProduct && Product.findById(source.reinvestProduct, system);
		  if (!product) return;
		  if ((system.currentTime - lastBuy) < product.limits.minBuyInterval) return;

		  const workingWallets = Wallet.findAll({source, coin, type: 'working'}, system);
		  const workingValue = workingWallets.reduce((prev, it) => prev + it.value, 0);

		  const productPrice = exchange(product.price, product.priceCoinId, coin, system);
		  const new_miner_count = Math.floor(workingValue / productPrice);

		  if (new_miner_count > 0 && (!product.limits.minCount || new_miner_count >= product.limits.minCount)) {
			const order_price = new_miner_count * productPrice;
			const price_ratio = order_price / workingValue;
			const owners: { [_: string]: number } = {};

			system.users.forEach((user) => {
			  const workingWallet = Wallet.find({source, coin, user, type: 'working'}, system, false);
			  if (!workingWallet || workingWallet.value <= 0) return;
			  const share_price = (workingWallet.value * price_ratio);
			  workingWallet.value -= share_price;
			  liveWallet.value -= share_price;
			  const share = toPrec(share_price / order_price, 8);
			  if (share > 0)
				owners[user.id] = share;
			});

			const newWorker = Worker.newWorkerFromProduct({
			  source: source,
			  product,
			  owners,
			  start_day: system.currentTime,
			  count: new_miner_count,
			}, system);
			lastBuy = system.currentTime;
		  }
		});
	  }
	);
  }

  return system;
}

export const showPredict = async () => {
  const baseSystem: System = JSON.parse(JSON.stringify(System.get()));
  const period = 30;

  let system: System = baseSystem;
  const startPredictDay = system.currentTime;

  console.clear();
  const periodPower = [];

  // @ts-ignore
  const silentPeriod = parseInt(eval(prompt("Enter Num of Periods (or skip to see in details):")));
  const silent = silentPeriod > 0;

  for (let i = 0; ; i++) {
	const lastPeriod = silent && silentPeriod < system.currentTime / period;

	let active_workers = system.workers
	  .filter((it) => it.startTime <= system.currentTime)
	  .filter((it) => it.endTime > system.currentTime)
	  .map((it) => ({
		start: it.startTime,
		end: it.endTime,
		power: it.power,
		owners: it.owners,
		productCount: it.purchase.productCount,
		allPrice: `${toPrec(it.purchase.sumPrice)} ${it.purchase.priceCoin.toString()}`,
	  }));
	const count = active_workers.length;
	const power = toPrec(active_workers.reduce((prev, el) => prev + el.power, 0));
	const power_day = toPrec(active_workers.reduce((prev, el) => prev + el.power * (el.end - system.currentTime), 0));
	const power_1m = toPrec(power_day / (1 * 30));
	const power_3m = toPrec(power_day / (3 * 30));
	const power_6m = toPrec(power_day / (6 * 30));
	const power_1y = toPrec(power_day / (12 * 30));
	const power_2y = toPrec(power_day / (24 * 30));
	const power_3y = toPrec(power_day / (36 * 30));

	const workers = active_workers.map(it => ({
	  start: it.start,
	  end: it.end,
	  power: toPrec(it.power, 1),
	  productCount: toPrec(it.productCount, 1),
	  allPrice: it.allPrice,
	}));

	if (!silent || lastPeriod)
	  print({
		title: 'WORKERS', workers, count, power,
		power_day, power_1m, power_3m, power_6m,
		power_1y, power_2y, power_3y,
	  });

	const all_report = system.users.map(user => {
	  const userWallets = Wallet.findAll({user}, system);

	  const working = userWallets
		.filter(it => it.type == 'working')
		.map(it => exchange(it.value, it.coinId, uBTC, system))
		.reduce((prev, el) => prev + el, 0);

	  const saving = userWallets
		.filter(it => it.type == 'saving')
		.map(it => exchange(it.value, it.coinId, uBTC, system))
		.reduce((prev, el) => prev + el, 0);

	  const power = active_workers
		.map(it => [it.power, (typeof (it.owners) == 'string' ? it.owners == user.id ? 1 : 0 : it.owners[user.id] || 0)])
		.reduce((prev, el) => prev + el[0] * el[1], 0);

	  return ({
		'user': user.id,
		'Power': toPrec(power),
		'save mIRT': toPrec(exchange(saving, uBTC, mIRT)),
		'work mIRT': toPrec(exchange(working, uBTC, mIRT)),
		'save USDT': toPrec(exchange(saving, uBTC, USDT)),
		'work USDT': toPrec(exchange(working, uBTC, USDT)),
		'save uBTC': toPrec(saving),
		'work uBTC': toPrec(working),
	  });
	});
	const report = all_report.filter(it => it['save uBTC'] > 0 || it['work uBTC'] > 0 || it['Power'] > 0);
	const sum = {
	  'user': '--SUM--',
	  'Power': toPrec(report.reduce((p, x) => p + x['Power'], 0)),
	  'save mIRT': toPrec(report.reduce((p, x) => p + x['save mIRT'], 0)),
	  'work mIRT': toPrec(report.reduce((p, x) => p + x['work mIRT'], 0)),
	  'save USDT': toPrec(report.reduce((p, x) => p + x['save USDT'], 0)),
	  'work USDT': toPrec(report.reduce((p, x) => p + x['work USDT'], 0)),
	  'save uBTC': toPrec(report.reduce((p, x) => p + x['save uBTC'], 0)),
	  'work uBTC': toPrec(report.reduce((p, x) => p + x['work uBTC'], 0)),
	};
	if (report.length > 1) {
	  report.push({
		'user': '-------',
		'Power': '-------' as any,
		'save mIRT': '-------' as any,
		'work mIRT': '-------' as any,
		'save USDT': '-------' as any,
		'work USDT': '-------' as any,
		'save uBTC': '-------' as any,
		'work uBTC': '-------' as any,
	  });
	  report.push(sum);
	}

	periodPower.push({
	  i, day: system.currentTime,
	  saveIRT: sum["save mIRT"], saveUSDT: sum["save USDT"], saveBTC: sum["save uBTC"],
	  power, power_day,
	  power_1m, power_3m, power_6m,
	  power_1y, power_2y, power_3y,
	});

	if (!silent || lastPeriod) {
	  const predictDay = system.currentTime - startPredictDay;
	  const predictWeek = toPrec(predictDay / 7);
	  const predictMonth = toPrec(predictDay / 30);
	  const predictYear = toPrec(predictDay / 360);
	  print('User States', {system_day: system.currentTime, predictWeek, predictMonth, predictYear});
	  console.table(report);
	}

	if (power <= 0) break;

	if (lastPeriod) break;

	// @ts-ignore
	if (!silent && (prompt("predict next period? (Y,n)") || "Y") == 'n') break;

	system = predict(system, period, -startPredictDay);
  }

  console.table(periodPower);
  // @ts-ignore
  alert("to exit PREDICT page press")
};
