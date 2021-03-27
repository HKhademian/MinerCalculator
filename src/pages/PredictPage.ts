import {NO_SHARE, ShareSetting, System} from "../lib/System.ts";
import {Coin, exchange, M_IRT, BTC, USD, ETH} from "../lib/Coin.ts";
import {SavePolicy, User} from "../lib/User.ts";
import {Worker} from "../lib/Worker.ts";
import {errVal, print, toPrec} from "../util.ts";
import {Source} from "../lib/Source.ts";
import {Wallet} from "../lib/Wallet.ts";
import {Product} from "../lib/Product.ts";

const REPORT_COINS = [M_IRT/*, USD, BTC, ETH*/];

export const predict = (source_system: System, days: number = 30, timeShift: number = 0): System => {
  const system = JSON.parse(JSON.stringify(source_system)) as System;

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
		const worker_income = mineCoin.powerProfit * worker.power * worker.efficiency;
		const liveWallet = Wallet.find({source: mineSource, coin: mineCoin, type: 'live'}, system)!;
		liveWallet.value += worker_income;

		Object.entries(worker.owners).forEach(([owner_id, owner_share]) => {

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
				user: shareSetting.user,
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
		const liveWallet = Wallet.find({source, coin, type: 'live'}, system, false);
		if (!liveWallet || liveWallet.value <= 0) return;
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

		  let save = 0, work = 0;
		  if (!source.reinvest.product) {
			save = incomeWallet.value;
			work = 0;
		  } else if (savePolicy) {
			save = incomeWallet.value * savePolicy.rate;
			work = incomeWallet.value - save;
		  } else {
			save = 0;
			work = incomeWallet.value;
		  }
		  savingWallet.value += save;
		  workingWallet.value += work;
		  incomeWallet.value -= save + work;
		  liveWallet.value -= save;
		});
	  });
	});

	// reinvest
	system.sources.forEach(source => {
		system.coins.forEach(coin => {
		  const liveWallet = Wallet.find({source, coin, type: "live"}, system, false);
		  if (!liveWallet || liveWallet.value <= 0) return;
		  // const products = Product.findAll({company: source.company, mineCoin: coin}, system);

		  const product = source.reinvest.product && Product.findById(source.reinvest.product, system);
		  if (!product) return;

		  const lastBuy = system.workers.length <= 0 ? -Infinity : system.workers
			.filter(it => it.source == source.id)
			.reduce((p, it) => p.startTime > it.startTime ? p : it, system.workers[0])
			.startTime;
		  if ((system.currentTime - lastBuy) < source.reinvest.minInterval) return;

		  const workingWallets = Wallet.findAll({source, coin, type: 'working'}, system);
		  const workingValue = workingWallets.reduce((prev, it) => prev + it.value, 0);

		  const productPrice = exchange(product.price, product.priceCoin, coin, system);
		  const new_miner_count = Math.floor(workingValue / productPrice);

		  if (new_miner_count > 0 && (!source.reinvest.minCount || new_miner_count >= source.reinvest.minCount)) {
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
			  startTime: system.currentTime,
			  count: new_miner_count,
			  purchase: {type: 'reinvest'},
			}, system);
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
  let prev: Report | undefined = undefined;

  for (let i = 0; ; i++) {
	const lastPeriod = silent && silentPeriod < system.currentTime / period;

	let active_workers = system.workers
	  .filter((it) => it.startTime <= system.currentTime)
	  .filter((it) => it.endTime > system.currentTime)
	  .map((it) => ({
		life: {s: it.startTime, e: it.endTime, r: it.endTime - it.startTime},
		product: {s: it.source, t: it.purchase.type, p: it.purchase.product, c: toPrec(it.purchase.productCount, 1)},
		power: it.power, owners: it.owners,
		price: Coin.valueStr(it.purchase.sumPrice, it.purchase.priceCoin, undefined, system),
	  }));
	const count = active_workers.length;
	const power = toPrec(active_workers.reduce((prev, el) => prev + el.power, 0), 0);
	const power_1d = toPrec(active_workers.reduce((prev, el) => prev + el.power * (el.life.e - system.currentTime), 0), 0);
	const power_1m = toPrec(power_1d / (30 * 1), 0);
	const power_3m = toPrec(power_1d / (30 * 3), 0);
	const power_6m = toPrec(power_1d / (30 * 6), 0);
	const power_1y = toPrec(power_1d / (30 * 12), 0);
	const power_2y = toPrec(power_1d / (30 * 24), 0);
	const power_3y = toPrec(power_1d / (30 * 36), 0);

	const workers = active_workers.map(it => ({
	  life: it.life,
	  product: it.product,
	  power: toPrec(it.power, 1),
	  price: it.price,
	}));

	if (!silent || lastPeriod)
	  print({
		title: 'WORKERS', workers, count, power,
		power_1d, power_1m, power_3m, power_6m,
		power_1y, power_2y, power_3y,
	  });

	const all_report = system.users.map(user => {
	  const userWallets = Wallet.findAll({user}, system);

	  const working = userWallets
		.filter(it => it.type == 'working')
		.map(it => exchange(it.value, it.coin, BTC, system))
		.reduce((prev, el) => prev + el, 0);

	  const saving = userWallets
		.filter(it => it.type == 'saving')
		.map(it => exchange(it.value, it.coin, BTC, system))
		.reduce((prev, el) => prev + el, 0);

	  const power = active_workers
		.map(it => [it.power, (typeof (it.owners) == 'string' ? it.owners == user.id ? 1 : 0 : it.owners[user.id] || 0)])
		.reduce((prev, el) => prev + el[0] * el[1], 0);

	  return ({'user': user.title, power, saving, working});
	});
	const sum: Report = {
	  'user': '---SUM---',
	  'power': all_report.reduce((p, x) => p + x.power, 0),
	  'saving': all_report.reduce((p, x) => p + x.saving, 0),
	  'working': all_report.reduce((p, x) => p + x.working, 0),
	};
	periodPower.push({
	  i, day: system.currentTime,
	  saving: sum.saving,
	  power, power_1d,
	  power_1m, power_3m, power_6m,
	  power_1y, power_2y, power_3y,
	});

	const change: Report | undefined = prev && {
	  'user': '--CHG--',
	  'power': sum.power - prev.power,
	  'saving': sum.saving - prev.saving,
	  'working': sum.working - prev.working,
	};
	prev = sum;

	if (!silent || lastPeriod) {
	  const prdDay = system.currentTime - startPredictDay;
	  const prdWeek = toPrec(prdDay / 7);
	  const prdMonth = toPrec(prdDay / 30);
	  const prdYear = toPrec(prdDay / 360);
	  print('User States', {sysDay: system.currentTime, prdDay, prdWeek, prdMonth, prdYear});


	  const splitter = {
		'user': '-------',
		'power': '-------' as any,
		'saving': '-------' as any,
		'working': '-------' as any,
	  };
	  const convert = (it: Report | undefined) => (it && ({
		'user': it.user,
		'power': toPrec(it.power, 0),
		'saving': Coin.toString(it.saving, BTC, REPORT_COINS, undefined, system),
		'working': Coin.toString(it.working, BTC, REPORT_COINS, undefined, system),
	  })) || splitter;
	  const report = all_report.filter(it => it.saving > 0 || it.working > 0 || it.power > 0).map(convert);
	  console.table([...report, splitter, convert(sum), convert(change)]);

	  // to watch wallets
	  const wallets = [
		...Wallet.findAll({type: "live"}, system),

		...Wallet.findAll({type: "income"}, system),
	  ]
		.map(it => {
		  it.value = toPrec(it.value, 8);
		  return it;
		})
		.filter(it => it.value != 0);
	  if (wallets.length) console.table(wallets);
	}

	if (power <= 0) break;
	if (lastPeriod) break;
	// @ts-ignore
	if (!silent && (prompt("predict next period? (Y,n)") || "Y") == 'n') break;

	system = predict(system, period, -startPredictDay);
  }

  console.table(periodPower);
  // @ts-ignore
  alert("to exit PREDICT page press");

  type Report = {
	user: string, power: number, saving: number, working: number,
  };
};
