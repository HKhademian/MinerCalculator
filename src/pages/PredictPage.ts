import {System} from "../lib/System.ts";
import {Coin, exchange, M_IRT, BTC, USD, ETH} from "../lib/Coin.ts";
import {print, toPrec} from "../util.ts";
import {Wallet} from "../lib/Wallet.ts";
import {Routines} from "../lib/Routines.ts";

const REPORT_COINS = [M_IRT/*, USD, BTC, ETH*/];

export const showPredict = async (sourceSystem?: System) => {
  const baseSystem: System = JSON.parse(JSON.stringify(sourceSystem || System.get()));
  const startPredictDay = baseSystem.currentTime;
  const period = 30;
  const periodPower = [];

  console.clear();
  // @ts-ignore
  const silentPeriod = parseInt(eval(prompt("Enter Num of Periods (or skip to see in details):")));
  const silent = silentPeriod > 0;
  let prev: Report | undefined = undefined;

  for (let system: System = baseSystem, i = 0; ; i++) {
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
	const power = toPrec(active_workers.reduce((prev, el) => prev + el.power, 0), 0);
	const power_1d = toPrec(active_workers.reduce((prev, el) => prev + el.power * (el.end - system.currentTime), 0), 0);
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
	  print({
		title: 'WORKERS', count, power,
		power_1d, power_1m, power_3m, power_6m,
		power_1y, power_2y, power_3y,
	  });

	  const sel_workers = worker.length <= 25 ? worker : [
		...worker.slice(0, 10),
		Object.fromEntries(Object.keys(worker[0]).map(it => [it, "..."])),
		...worker.slice(Math.max(worker.length - 10, 1)),
	  ]
	  console.table(sel_workers);
	}

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
	  saving: Coin.toString(sum.saving, BTC, [M_IRT, USD, BTC], undefined, system),
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

	  const prdDay = system.currentTime - startPredictDay;
	  const prdWeek = toPrec(prdDay / 7);
	  const prdMonth = toPrec(prdDay / 30);
	  const prdYear = toPrec(prdDay / 360);
	  print('^ User States ^', {sysDay: system.currentTime, prdDay, prdWeek, prdMonth, prdYear});
	}

	if (power <= 0) break;
	if (lastPeriod) break;
	// @ts-ignore
	if (!silent && (prompt("predict next period? (Y,n)") || "Y") == 'n') break;

	system = Routines.predict(system, period, -startPredictDay);
  }

  console.table(periodPower);
  // @ts-ignore
  alert("to exit PREDICT page press");

  type Report = {
	user: string, power: number, saving: number, working: number,
  };
};
