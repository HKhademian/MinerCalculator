import './_global.ts';
import {NO_SHARE, ShareSetting, System} from "./System.ts";
import {Wallet} from "./Wallet.ts";
import {Coin, DOGE, ETH, exchange, LTC, M_IRT, USD} from "./Coin.ts";
import {Source} from "./Source.ts";
import {SavePolicy, User} from "./User.ts";
import {Product} from "./Product.ts";
import {Worker} from "./Worker.ts";
import {errVal, exists, toPrec} from "../util.ts";
import * as path from "https://deno.land/std/path/mod.ts";

export namespace Routines {
  export const predict = async (system: System, days: number = 30, timeShift: number = 0) => {
	(await Wallet.findAll({type: "live"}, system)).forEach(liveWallet => {
	  // TODO: may add some err log
	  liveWallet.lastUpdate = system.currentTime;
	});

	for (let i = 0; i < days; i++) {
	  system.currentTime++;

	  // calculate each active miner profit
	  await system.workers
		.filter((it) => it.startTime <= system.currentTime)
		.filter((it) => it.endTime >= system.currentTime)
		.forEachAwait(async (worker) => {
		  const mineCoin: Coin = await Coin.findById(worker.coin, system) || errVal("worker coin not found");
		  const mineSource: Source = await Source.findById(worker.source, system) || errVal("worker source not found");

		  // total mine income from current miner in a time period
		  const worker_income = mineCoin.powerProfit * worker.power * worker.efficiency;
		  const liveWallet = (await Wallet.find({source: mineSource, coin: mineCoin, type: 'live'}, system))!;
		  (liveWallet as any).newValue = ((liveWallet as any).newValue || liveWallet.value) + worker_income;
		});

	  await (await Wallet.findAll({type: "live"}, system)).forEachAwait(async liveWallet => {
		await updateIncome(system, liveWallet, system.currentTime, (liveWallet as any).newValue || 0, timeShift, true);
		delete (liveWallet as any).newValue;
	  });

	  await reinvestWorkingAlg1(system);
	}
  }

  export const reinvestWorkingAlg1 = async (system: System): Promise<Worker[]> => {
	const workers: Worker[] = [];
	await system.sources.forEachAwait(async source => {
	  await system.coins.forEachAwait(async coin => {
		const liveWallet = await Wallet.find({source, coin, type: "live"}, system, false);
		if (!liveWallet || liveWallet.value <= 0) return;
		// const products = Product.findAll({company: source.company, mineCoin: coin}, system);

		const product = source.reinvest.product && await Product.findById(source.reinvest.product, system);
		if (!product) return;

		const lastBuy = system.workers.length <= 0 ? -Infinity : system.workers
		  .filter(it => it.source == source.id)
		  .maxBy(it => it.startTime)!
		  .startTime;
		if ((system.currentTime - lastBuy) < source.reinvest.minInterval) return;

		const workingWallets = await Wallet.findAll({source, coin, type: 'working'}, system);
		const workingValue = workingWallets.sumBy(it => it.value);

		const productPrice = await exchange(product.price, product.priceCoin, coin, system);
		const new_miner_count = Math.floor(workingValue / productPrice);

		if (new_miner_count <= 0 || (source.reinvest.minCount && new_miner_count < source.reinvest.minCount)) return;

		const order_price = new_miner_count * productPrice;
		const price_ratio = order_price / workingValue;
		const owners: { [_: string]: number } = {};

		await system.users.forEachAwait(async user => {
		  const workingWallet = await Wallet.find({source, coin, user, type: 'working'}, system, false);
		  if (!workingWallet || workingWallet.value <= 0) return;
		  const share_price = (workingWallet.value * price_ratio);
		  workingWallet.value -= share_price;
		  liveWallet.value -= share_price;
		  const share = toPrec(share_price / order_price, 8);
		  if (share > 0)
			owners[user.id] = share;
		});

		const newWorker = await Worker.createWorkerFromProduct({
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

  export const updateIncome = async (system: System, wallet: string | Wallet, curDay: number, curValue: number, timeShift: number = 0, updateLiveWallet: boolean = false) => {
	// curValue >= 0 || errVal("cannot process neg value");

	const liveWallet = await Wallet.find({wallet}, system) || errVal("wallet not found");
	liveWallet.type == "live" || errVal("wallet type is not live");
	liveWallet.user == undefined || errVal("liveWallet has owner");

	const prevValue = liveWallet.value;
	const prevDay = liveWallet.lastUpdate;
	curDay > prevDay || errVal("curDay must be gr than prevDay");

	const coin = await Coin.findById(liveWallet.coin, system) || errVal("liveWallet coin not found");
	const source = await Source.findById(liveWallet.source, system) || errVal("liveWallet source not found");

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
	const sumPower = Object.values(powers).sumBy();
	if (sumPower <= 0) return; // TODO: check

	const totalChangeValue = curValue - prevValue;
	const incomes: { [_: string]: number } = {};
	await Object.entries(powers)
	  .forEachAwait(async ([userId, power]) => {
		const user = await User.findById(userId, system) || errVal("cannot find miner-owner-user");
		const income = totalChangeValue * (power / sumPower);
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

	await system.users.forEachAwait(async user => {
	  if (!(user.id in incomes) || !(incomes[user.id] > 0)) return;
	  const workingWallet = (await Wallet.find({source, coin, user, type: 'working'}, system))!;
	  const savingWallet = (await Wallet.find({source, coin, user, type: 'saving'}, system))!;

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

  export const registerWithdraw = async (system: System, wallet: string | Wallet, value: number, transFee: number, share: string | { [_: string]: number }) => {
	const liveWallet = await Wallet.find({wallet}, system) || errVal("cannot find liveWallet");
	liveWallet.type == 'live' || errVal("liveWallet type is incorrect");
	liveWallet.user == undefined || errVal("liveWallet cannot have owner");
	liveWallet.lastUpdate == system.currentTime || errVal("liveWallet value is not up to date");

	const owners = typeof share == "string" ? {share: 1} : share;
	Object.keys(owners).length > 0 || errVal("please specify user share");
	Object.values(owners).sumBy() == 1 || errVal("share sum must be 1");
  }


  export const calculateRates = async ({forceRemote, log}: { forceRemote?: boolean, log?: boolean }) => {
	const RATES_FILE = "./data/.rates.json";
	const RATES_URL = "https://core.jeeb.io/api/v3/markets/rates";

	interface Rate {
	  id: string;
	  baseCurrencyId: string;
	  targetCurrencyId: string;
	  baseCurrencyName: string;
	  targetCurrencyName: string;
	  baseCurrencyPrecision: number;
	  targetCurrencyPrecision: number;
	  buyRate: number;
	  sellRate: number;
	  averageRate: number;
	  change24: number;
	}

	let rates: Rate[] = [];
	let valid = false;

	if (!forceRemote && await exists(RATES_FILE)) {
	  let local_rates = JSON.parse(await Deno.readTextFile(RATES_FILE)) as { time: number, result: Rate[] };
	  rates = local_rates.result;
	  if (new Date().getTime() - local_rates.time < 6 * 60 * 60 * 1000) {
		valid = true;
		console.log("load rates from local cache");
	  } else {
		console.warn("load rates cache is outdated");
	  }
	}

	if (forceRemote || !rates || rates.length <= 0 || !valid) {
	  await Deno.mkdir(path.parse(RATES_FILE).dir, {recursive: true});
	  rates = (await (await fetch(RATES_URL)).json())?.result;
	  await Deno.writeTextFile(RATES_FILE, JSON.stringify({time: new Date().getTime(), result: rates}));
	  console.info("load rates from remote source");
	}

	if (!rates) {
	  // @ts-ignore
	  alert("cannot fetch rates");
	  return;
	}

	const btc_usd = rates.find((it: any) => it.baseCurrencyId == "BTC" && it.targetCurrencyId == "USDT")!!;
	const btc_irt = rates.find((it: any) => it.baseCurrencyId == "BTC" && it.targetCurrencyId == "IRT")!!;
	const eth_btc = rates.find((it: any) => it.baseCurrencyId == "ETH" && it.targetCurrencyId == "BTC")!!;
	const ltc_btc = rates.find((it: any) => it.baseCurrencyId == "LTC" && it.targetCurrencyId == "BTC")!!;
	const doge_btc = rates.find((it: any) => it.baseCurrencyId == "DOGE" && it.targetCurrencyId == "BTC")!!;

	USD.value = btc_usd.averageRate;
	M_IRT.value = btc_irt.averageRate / 1_000_000;
	ETH.value = 1 / eth_btc.averageRate;
	LTC.value = 1 / ltc_btc.averageRate;
	DOGE.value = 1 / doge_btc.averageRate;

	if (log) console.log({btc_usd, USD, btc_irt, M_IRT, eth_btc, ETH, ltc_btc, LTC, doge_btc, DOGE});
  };

}
