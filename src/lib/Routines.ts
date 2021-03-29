import './_global.ts';
import {NO_SHARE, ShareSetting, System} from "./System.ts";
import {Wallet} from "./Wallet.ts";
import {Coin, exchange} from "./Coin.ts";
import {Source} from "./Source.ts";
import {SavePolicy, User} from "./User.ts";
import {Product} from "./Product.ts";
import {Worker} from "./Worker.ts";
import {errVal, toPrec} from "../util.ts";

export namespace Routines {
  export const predict = (system: System, days: number = 30, timeShift: number = 0) => {
	Wallet.findAll({type: "live"}, system).forEach(liveWallet => {
	  // TODO: may add some err log
	  liveWallet.lastUpdate = system.currentTime;
	});

	for (let i = 0; i < days; i++) {
	  system.currentTime++;

	  // calculate each active miner profit
	  system.workers
		.filter((it) => it.startTime <= system.currentTime)
		.filter((it) => it.endTime >= system.currentTime)
		.forEach((worker) => {
		  const mineCoin: Coin = Coin.findById(worker.coin, system) || errVal("worker coin not found");
		  const mineSource: Source = Source.findById(worker.source, system) || errVal("worker source not found");

		  // total mine income from current miner in a time period
		  const worker_income = mineCoin.powerProfit * worker.power * worker.efficiency;
		  const liveWallet = Wallet.find({source: mineSource, coin: mineCoin, type: 'live'}, system)!;
		  (liveWallet as any).newValue = ((liveWallet as any).newValue || liveWallet.value) + worker_income;
		});

	  Wallet.findAll({type: "live"}, system).forEach(liveWallet => {
		updateIncome(system, liveWallet, system.currentTime, (liveWallet as any).newValue || 0, timeShift, true);
		delete (liveWallet as any).newValue;
	  });

	  reinvestWorkingAlg1(system);
	}
  }

  export const reinvestWorkingAlg1 = (system: System): Worker[] => {
	const workers: Worker[] = [];
	system.sources.forEach(source => {
	  system.coins.forEach(coin => {
		const liveWallet = Wallet.find({source, coin, type: "live"}, system, false);
		if (!liveWallet || liveWallet.value <= 0) return;
		// const products = Product.findAll({company: source.company, mineCoin: coin}, system);

		const product = source.reinvest.product && Product.findById(source.reinvest.product, system);
		if (!product) return;

		const lastBuy = system.workers.length <= 0 ? -Infinity : system.workers
		  .filter(it => it.source == source.id)
		  .maxBy(it => it.startTime)!
		  .startTime;
		if ((system.currentTime - lastBuy) < source.reinvest.minInterval) return;

		const workingWallets = Wallet.findAll({source, coin, type: 'working'}, system);
		const workingValue = workingWallets.sumBy(0, it => it.value);

		const productPrice = exchange(product.price, product.priceCoin, coin, system);
		const new_miner_count = Math.floor(workingValue / productPrice);

		if (new_miner_count <= 0 || (source.reinvest.minCount && new_miner_count < source.reinvest.minCount)) return;

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

		const newWorker = Worker.createWorkerFromProduct({
		  source: source,
		  product,
		  owners,
		  startTime: system.currentTime,
		  count: new_miner_count,
		  purchase: {type: 'reinvest'},
		}, system);
		workers.push(newWorker);
	  });
	});
	return workers;
  }

  export const updateIncome = (system: System, wallet: string | Wallet, curDay: number, curValue: number, timeShift: number = 0, updateLiveWallet: boolean = false) => {
	// curValue >= 0 || errVal("cannot process neg value");

	const liveWallet = Wallet.find({wallet}, system) || errVal("wallet not found");
	liveWallet.type == "live" || errVal("wallet type is not live");
	liveWallet.user == undefined || errVal("liveWallet has owner");

	const prevValue = liveWallet.value;
	const prevDay = liveWallet.lastUpdate;
	curDay > prevDay || errVal("curDay must be gr than prevDay");

	const coin = Coin.findById(liveWallet.coin, system) || errVal("liveWallet coin not found");
	const source = Source.findById(liveWallet.source, system) || errVal("liveWallet source not found");

	const powers: { [_: string]: number } = {};
	for (let day = prevDay; day < curDay; day++) {
	  const dayWorkers = system.workers.filter(it =>
		(it.startTime < day) &&
		(it.endTime >= day) &&
		(it.source == source.id) &&
		(it.coin == coin.id)
	  );
	  dayWorkers.forEach(worker => {
		Object.entries(worker.owners).forEach(([userId, share]) => {
		  powers[userId] = (powers[userId] || 0) + share * worker.power;
		});
	  });
	}
	const sumPower = Object.entries(powers).sumBy(0, ([_, pow]) => pow);
	if (sumPower <= 0) return; // TODO: check

	const totalChangeValue = curValue - prevValue;
	const incomes: { [_: string]: number } = {};
	Object.entries(powers)
	  .map(([userId, power]): [User, number] => ([
		User.findById(userId, system)! || errVal("cannot find miner-owner-user"),
		totalChangeValue * (power / sumPower),
	  ]))
	  .forEach(([user, income]) => {
		let shareSettings: ShareSetting[] = [];
		let remainIncome = income;

		shareSettings.push(user.charityShare || system.charityShare || NO_SHARE);
		shareSettings.push(user.managerShare || system.managerShare || NO_SHARE);

		if (user.agentsShare)
		  if (user.agentsShare instanceof Array)
			shareSettings.push(...user.agentsShare);
		  else
			shareSettings.push(...[user.agentsShare]);

		shareSettings.forEach(shareSetting => {
		  let thisIncome = income * shareSetting.share;

		  if (thisIncome == 0) return;
		  // take this share from owner
		  remainIncome -= thisIncome;
		  incomes[shareSetting.user] = (incomes[shareSetting.user] || 0) + thisIncome;
		  // TODO: add income record to database
		});

		if (remainIncome != 0) {
		  incomes[user.id] = (incomes[user.id] || 0) + remainIncome;
		  // TODO: add income record to database
		}
	  });

	liveWallet.value = curValue;
	liveWallet.lastUpdate = curDay;
	// TODO: add live wallet value record to database


	// split incomes

	system.users.forEach(user => {
	  if (!(user.id in incomes) || !(incomes[user.id] > 0)) return;
	  const workingWallet = Wallet.find({source, coin, user, type: 'working'}, system)!;
	  const savingWallet = Wallet.find({source, coin, user, type: 'saving'}, system)!;

	  // if it's neg income! somehow . it should taken from working wallet
	  if (incomes[user.id] < 0) {
		workingWallet.value += incomes[user.id];
		incomes[user.id] = 0;
	  }

	  // pay saving loans
	  if (savingWallet.value < 0 && incomes[user.id] > 0) {
		savingWallet.value += incomes[user.id];
		incomes[user.id] = 0;
		if (savingWallet.value > 0) {
		  incomes[user.id] = savingWallet.value;
		  savingWallet.value = 0;
		}
	  }

	  // pay working loans
	  if (workingWallet.value < 0 && incomes[user.id] > 0) {
		workingWallet.value += incomes[user.id];
		incomes[user.id] = 0;
		if (workingWallet.value > 0) {
		  incomes[user.id] = workingWallet.value;
		  workingWallet.value = 0;
		}
	  }

	  // split remaining to save and work

	  if (incomes[user.id] != 0) {
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

		let save: number, work: number;
		if (!source.reinvest.product) {
		  save = incomes[user.id];
		  work = 0;
		} else if (savePolicy) {
		  save = incomes[user.id] * savePolicy.rate;
		  work = incomes[user.id] - save;
		} else {
		  save = 0;
		  work = incomes[user.id];
		}

		savingWallet.value += save;
		incomes[user.id] -= save;

		workingWallet.value += work;
		incomes[user.id] -= work;

		if (updateLiveWallet) liveWallet.value -= save; // TODO: check
	  }

	  !(incomes[user.id] > 0) ||
	  errVal("there is some income leftover!");
	});
  }

  export const registerWithdraw = (system: System, wallet: string | Wallet, value: number, transFee: number, share: string | { [_: string]: number }) => {
	const liveWallet = Wallet.find({wallet}, system) || errVal("cannot find liveWallet");
	liveWallet.type == 'live' || errVal("liveWallet type is incorrect");
	liveWallet.user == undefined || errVal("liveWallet cannot have owner");
	liveWallet.lastUpdate == system.currentTime || errVal("liveWallet value is not up to date");

	const owners = typeof share == "string" ? {share: 1} : share;
	Object.keys(owners).length > 0 || errVal("please specify user share");
	Object.values(owners).sumBy(0) == 1 || errVal("share sum must be 1");
  }
}
