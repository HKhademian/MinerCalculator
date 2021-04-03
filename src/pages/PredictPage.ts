import '../lib/_global.ts';
import {System} from "../lib/System.ts";
import {Coin, exchange, M_IRT, BTC, USD, ETH} from "../lib/Coin.ts";
import {print, toPrec} from "../util.ts";
import {Wallet} from "../lib/Wallet.ts";
import {Routines} from "../lib/Routines.ts";
import {Source} from "../lib/Source.ts";

const REPORT_COINS = [M_IRT, USD, BTC,/* ETH */];

export const showPredict = async (
  {
	system: sourceSystem,
	periodLen = 0,
	periods = 0,
	source,
  }: {
	system?: System,
	periodLen?: number,
	periods?: number,
	source?: string | Source,
  } = {}
) => {
  console.clear();

  const system: System = JSON.parse(JSON.stringify(sourceSystem || await System.get()));
  const startPredictDay = system.currentTime;

  source = source ? source : prompt("Enter target source (or skip):") || undefined;
  periodLen = periodLen > 0 ? periodLen : parseInt(eval(prompt("Enter Num of Days a Period:", "30") || "30"));
  periods = periods > 0 ? periods : parseInt(eval(prompt("Enter Num of Periods (or skip to see in details):") || "")) || 0;
  const silent = periods > 0;

  const limitSource = !source ? undefined : typeof source == "string" ? source : source.id;
  const periodPower = [];

  for (let i = 0, prev: Report | undefined = undefined; ; i++) {
	const predictDay = system.currentTime - startPredictDay;
	const lastPeriod = silent && periods < (predictDay / periodLen);

	let active_workers = await system.workers
	  .filter((it) => it.startTime <= system.currentTime)
	  .filter((it) => it.endTime > system.currentTime)
	  .filter(it => !limitSource || it.source == limitSource)
	  .mapAwait(async (it) => ({
		start: it.startTime,
		end: it.endTime,
		life: it.endTime - it.startTime,
		source: it.source,
		type: it.purchase.type,
		prod: it.purchase.product,
		count: toPrec(it.purchase.count, 1),
		power: toPrec(it.power, 1),
		owners: it.owners,
		price: await Coin.valueStr(it.purchase.price, it.purchase.priceCoin, undefined, system),
	  }));
	const count = active_workers.length;
	const power = toPrec(active_workers.sumBy(it => it.power), 0);
	const power_1d = toPrec(active_workers.sumBy(it => it.power * (it.end - system.currentTime)), 0);
	const power_1m = toPrec(power_1d / (30 * 1), 0);
	const power_3m = toPrec(power_1d / (30 * 3), 0);
	const power_6m = toPrec(power_1d / (30 * 6), 0);
	const power_1y = toPrec(power_1d / (30 * 12), 0);
	const power_2y = toPrec(power_1d / (30 * 24), 0);
	const power_3y = toPrec(power_1d / (30 * 36), 0);

	const worker = active_workers.map(it =>
	  Object.fromEntries(Object.entries(it).filter(el => ['start', 'end', 'life', 'power', 'price', 'count', 'product', 'source'].includes(el[0])))
	);
	if (!silent || lastPeriod) {
	  const sel_workers = worker.length <= 25 ? worker : [
		...worker.slice(0, 10),
		Object.fromEntries(Object.keys(worker[0]).map(it => [it, "..."])),
		...worker.slice(Math.max(worker.length - 10, 1)),
	  ]
	  console.table(sel_workers);

	  console.log('WORKERS', {
		C: count, P: power,
		/*P1d: power_1d, P1m: power_1m, P3m: power_3m,*/ P6m: power_6m,
		P1y: power_1y, P2y: power_2y, P3y: power_3y,
	  });
	}

	const all_report = await system.users.mapAwait(async user => {
	  const userWallets = await Wallet.findAll({user, source: limitSource}, system);

	  const working = (await userWallets
		  .filter(it => it.type == 'working')
		  .mapAwait(async it => await exchange(it.value, it.coin, BTC, system))
	  ).sumBy();

	  const saving = (await userWallets
		  .filter(it => it.type == 'saving')
		  .mapAwait(async it => await exchange(it.value, it.coin, BTC, system))
	  ).sumBy();

	  const power = active_workers
		.map(it => [it.power, (typeof (it.owners) == 'string' ? it.owners == user.id ? 1 : 0 : it.owners[user.id] || 0)])
		.sumBy(it => it[0] * it[1]);

	  return ({'user': user.title, power, saving, working});
	});
	const sum: Report = {
	  'user': '---SUM---',
	  'power': all_report.sumBy(it => it.power),
	  'saving': all_report.sumBy(it => it.saving),
	  'working': all_report.sumBy(it => it.working),
	};

	const change: Report | undefined = prev && {
	  'user': '--CHG--',
	  'power': sum.power - prev.power,
	  'saving': sum.saving - prev.saving,
	  'working': sum.working - prev.working,
	};
	prev = sum;

	if (!silent || lastPeriod) {
	  const splitter: Report = {
		'user': '-------',
		'power': '-------' as any,
		'saving': '-------' as any,
		'working': '-------' as any,
	  };
	  const convert = async (it: Report | undefined) => (it && ({
		'user': it.user,
		'power': toPrec(it.power, 0),
		'saving': await Coin.toStr(it.saving, BTC, REPORT_COINS, undefined, system),
		'working': await Coin.toStr(it.working, BTC, REPORT_COINS, undefined, system),
	  })) || splitter;
	  const report = await all_report.filter(it => it.saving > 0 || it.working > 0 || it.power > 0).mapAwait(convert);
	  console.table([...report, splitter, await convert(sum), await convert(change)]);

	  // // to watch wallets
	  // const wallets = [
	  // ...Wallet.findAll({type: "live"}, system),
	  //
	  // ...Wallet.findAll({type: "income"}, system),
	  // ]
	  // .map(it => {
	  //   it.value = toPrec(it.value, 8);
	  //   return it;
	  // })
	  // .filter(it => it.value != 0);
	  // if (wallets.length) console.table(wallets);

	  const prdWeek = toPrec(predictDay / 7, 1);
	  const prdMonth = toPrec(predictDay / 30, 1);
	  const prdYear = toPrec(predictDay / 360, 1);
	  print('^ User States ^', {sysDay: system.currentTime, prdYear, prdMonth, prdWeek, prdDay: predictDay});
	}

	await Routines.predict(system, periodLen, 0/*-startPredictDay*/);

	const Pdie = toPrec(system.workers.filter(it => (!limitSource || it.source == limitSource) &&
	  (it.endTime >= (system.currentTime - periodLen)) && (it.endTime < system.currentTime)
	).sumBy(it => it.power), 0);
	const Pbuy = toPrec(system.workers.filter(it => (!limitSource || it.source == limitSource) &&
	  (it.startTime >= (system.currentTime - periodLen)) && (it.startTime < system.currentTime)
	).sumBy(it => it.power), 0);
	const Pchg = toPrec(Pbuy - Pdie, 0);

	periodPower.push({
	  /* i, */
	  Y: toPrec(system.currentTime / (30 * 12), 1),
	  M: toPrec(system.currentTime / 30, 1),
	  D: system.currentTime,
	  saving: await Coin.toStr(sum.saving, BTC, [M_IRT, USD, BTC], undefined, system),
	  P: power,
	  Pchg, /*pow1d: power_1d,
	  P1m: power_1m, P3m: power_3m,*/
	  P6m: power_6m,
	  P1y: power_1y,
	  P2y: power_2y,
	  P3y: power_3y,
	  Pbuy, Pdie,
	});

	if (lastPeriod) break;
	if (power <= 0) break;
	if (!silent && prompt("predict next period? (Y,n)") == 'n') break;
  }

  console.table(periodPower);
  alert("to exit PREDICT page press");

  type Report = {
	user: string, power: number, saving: number, working: number,
  };
};
