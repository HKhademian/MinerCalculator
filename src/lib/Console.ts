import "./_global.ts";
import {System} from "./System.ts";
import {askMenu} from "../util.ts";
import {Wallet} from "./Wallet.ts";
import {BTC, Coin} from "./Coin.ts";
import {Routines} from "./Routines.ts";
import {Hamyar, Pishtaz} from "../baseSystem.ts";
import {Source} from "./Source.ts";
import {Product} from "./Product.ts";

const evalInScope = (js: string, contextAsScope: any, onErr?: (er: Error) => any): any => {
  try {
	return eval.bind(contextAsScope).call(contextAsScope, js);
  } catch (e) {
	if (onErr) onErr(e);
	return e;
  }
}

export async function showConsole() {
  let res = undefined;
  while (true) {
	let system = System.get();
	let cmd = prompt("CMD>");
	if (!cmd || !cmd.length) continue;
	if (["break", "exit", ":q"].includes(cmd.toLowerCase())) break;
	res = evalInScope(cmd, {System, Coin, Worker, Source, Product, system});
	if (res instanceof Promise) res = await res;
	console.log(res);
  }
  return res;
}


export const showTestPage = async () => await askMenu("test update income", [
  {title: "exit TEST page"},
], async () => {
  const system = JSON.parse(JSON.stringify(System.get()));

  // @ts-ignore
  const curDay = parseInt(prompt("enter new hamyar_s1 live day:", system.currentTime + 1));
  // @ts-ignore
  const curVal = parseFloat(prompt("enter new hamyar_s1 live value:", 0));
  const liveWallet = Wallet.find({source: Hamyar.SOURCE1, coin: BTC, type: "live"}, system)!;

  console.log("start", {liveWallet});
  console.table([
	...Wallet.findAll({
	  source: Hamyar.SOURCE1,
	  coin: BTC,
	  type: 'working'
	}, system).sort((a, b) => a.value - b.value),
	...Wallet.findAll({
	  source: Hamyar.SOURCE1,
	  coin: BTC,
	  type: 'saving'
	}, system).sort((a, b) => a.value - b.value),
  ]);
  // @ts-ignore
  alert("press");

  Routines.updateIncome(system, liveWallet, curDay, curVal);
  console.log("after update", {liveWallet});
  console.table([
	...Wallet.findAll({
	  source: Hamyar.SOURCE1,
	  coin: BTC,
	  type: 'working'
	}, system).sort((a, b) => a.value - b.value),
	...Wallet.findAll({
	  source: Hamyar.SOURCE1,
	  coin: BTC,
	  type: 'saving'
	}, system).sort((a, b) => a.value - b.value),
  ]);
  // @ts-ignore
  alert("press");

  console.log("after split", {liveWallet});
  console.table([
	...Wallet.findAll({
	  source: Hamyar.SOURCE1,
	  coin: BTC,
	  type: 'working'
	}, system).sort((a, b) => a.value - b.value),
	...Wallet.findAll({
	  source: Hamyar.SOURCE1,
	  coin: BTC,
	  type: 'saving'
	}, system).sort((a, b) => a.value - b.value),
  ]);
  console.log(
	Wallet.findAll({
	  source: Hamyar.SOURCE1,
	  coin: BTC,
	  type: 'working'
	}, system).sumBy(it => it.value),
	Wallet.findAll({
	  source: Hamyar.SOURCE1,
	  coin: BTC,
	  type: 'saving'
	}, system).sumBy(it => it.value),
  );
  // @ts-ignore
  alert("press");

}, {
  defaultChoice: 0,
});
