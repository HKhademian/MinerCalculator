import {exists, askMenu} from "../util.ts";
import {mETH, mIRT, uBTC, USDT} from "../lib/Coin.ts";

const RATES_FILE = "./.rates.json";
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

export const showRatePage = async () => await askMenu(
  "Rates Page", [
	{title: "exit RATES page"},
	{title: "fetch remote rates", action: () => calculateRates({forceRemote: true, log: true})},
  ], () => {
	console.log({uBTC, mETH, mIRT});
  });

export const calculateRates = async ({forceRemote, log}: { forceRemote?: boolean, log?: boolean }) => {
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
	rates = (await (await fetch(RATES_URL)).json())?.result;
	await Deno.writeTextFile(RATES_FILE, JSON.stringify({time: new Date().getTime(), result: rates}));
	console.info("load rates from remote source");
  }

  if (!rates) {
	// @ts-ignore
	alert("cannot fetch rates");
	return;
  }

  const btc_usdt = rates.find((it: any) => it.baseCurrencyId == "BTC" && it.targetCurrencyId == "USDT")!!;
  const eth_usdt = rates.find((it: any) => it.baseCurrencyId == "ETH" && it.targetCurrencyId == "USDT")!!;
  const usdt_irt = rates.find((it: any) => it.baseCurrencyId == "USDT" && it.targetCurrencyId == "IRT")!!;

  uBTC.value = 1 / btc_usdt.averageRate * 1_000_000;
  mETH.value = 1 / eth_usdt.averageRate * 1_000;
  mIRT.value = usdt_irt.averageRate / 1_000_000;

  if (log) console.log({btc_usdt, uBTC, eth_usdt, mETH, usdt_irt, mIRT});
};
