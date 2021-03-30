import '../lib/_global.ts';
import {System} from "../lib/System.ts";
import {Coin, exchange, M_IRT, BTC, USD, ETH} from "../lib/Coin.ts";
import {print, toPrec} from "../util.ts";
import {Wallet} from "../lib/Wallet.ts";
import {Routines} from "../lib/Routines.ts";

const REPORT_COINS = [M_IRT, USD, BTC,/* ETH */];

export const showPredict = async (sourceSystem?: System) => {
  const system: System = JSON.parse(JSON.stringify(sourceSystem || System.get()));
  const startPredictDay = system.currentTime;
  const periodPower = [];

  console.clear();

  const period = parseInt(eval(prompt("Enter Num of Days a Period:", "30") || "30"));
  const silentPeriod = parseInt(eval(prompt("Enter Num of Periods (or skip to see in details):") || "")) || 0;
  const silent = silentPeriod > 0;
  let prev: Report | undefined = undefined;

  for (let i = 0; ; i++) {
	const lastPeriod = silent && silentPeriod < system.currentTime / period;

	let active_workers = system.workers
	  .filter((it) => it.startTime <= system.currentTime)
	  .filter((it) => it.endTime > system.currentTime)
	  .map((it) => ({
		start: it.startTime,
		end: it.endTime,
		life: it.endTime - it.startTime,
		source: it.source,
		type: it.purchase.type,
		prod: it.purchase.product,
		count: toPrec(it.purchase.productCount, 1),
		power: toPrec(it.power, 1),
		owners: it.owners,
		price: Coin.valueStr(it.purchase.sumPrice, it.purchase.priceCoin, undefined, system),
	  }));
	const count = active_workers.length;
	const power = toPrec(active_workers.sumBy(0, it => it.power), 0);
	const power_1d = toPrec(active_workers.sumBy(0, it => it.power * (it.end - system.currentTime)), 0);
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

	const all_report = system.users.map(user => {
	  const userWallets = Wallet.findAll({user}, system);

	  const working = userWallets
		.filter(it => it.type == 'working')
		.sumBy(0, it => exchange(it.value, it.coin, BTC, system));

	  const saving = userWallets
		.filter(it => it.type == 'saving')
		.sumBy(0, it => exchange(it.value, it.coin, BTC, system));

	  const power = active_workers
		.map(it => [it.power, (typeof (it.owners) == 'string' ? it.owners == user.id ? 1 : 0 : it.owners[user.id] || 0)])
		.sumBy(0, it => it[0] * it[1]);

	  return ({'user': user.title, power, saving, working});
	});
	const sum: Report = {
	  'user': '---SUM---',
	  'power': all_report.sumBy(0, it => it.power),
	  'saving': all_report.sumBy(0, it => it.saving),
	  'working': all_report.sumBy(0, it => it.working),
	};

	const Pdie = system.workers.filter(it =>
	  it.endTime >= i * period && it.endTime < (i + 1) * period
	).sumBy(0, it => it.power);
	const Pbuy = system.workers.filter(it =>
	  it.startTime >= i * period && it.startTime < (i + 1) * period
	).sumBy(0, it => it.power);
	const Pchg = Pbuy - Pdie;

	periodPower.push({
	  i, day: system.currentTime,
	  saving: Coin.toString(sum.saving, BTC, [M_IRT, USD, BTC], undefined, system),
	  P: power, Pchg, /*pow1d: power_1d,
	  P1m: power_1m, P3m: power_3m,*/ P6m: power_6m,
	  P1y: power_1y, P2y: power_2y, P3y: power_3y,
	  /*Pbuy, Pdie,*/
	});

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
	  const convert = (it: Report | undefined) => (it && ({
		'user': it.user,
		'power': toPrec(it.power, 0),
		'saving': Coin.toString(it.saving, BTC, REPORT_COINS, undefined, system),
		'working': Coin.toString(it.working, BTC, REPORT_COINS, undefined, system),
	  })) || splitter;
	  const report = all_report.filter(it => it.saving > 0 || it.working > 0 || it.power > 0).map(convert);
	  console.table([...report, splitter, convert(sum), convert(change)]);

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

	  const prdDay = system.currentTime - startPredictDay;
	  const prdWeek = toPrec(prdDay / 7, 1);
	  const prdMonth = toPrec(prdDay / 30, 1);
	  const prdYear = toPrec(prdDay / 360, 1);
	  print('^ User States ^', {sysDay: system.currentTime, prdDay, prdWeek, prdMonth, prdYear});
	}

	if (lastPeriod) break;
	if (power <= 0) break;
	if (!silent && prompt("predict next period? (Y,n)") == 'n') break;

	Routines.predict(system, period, 0/*-startPredictDay*/);
  }

  console.table(periodPower);
  alert("to exit PREDICT page press");

  type Report = {
	user: string, power: number, saving: number, working: number,
  };
};
