import {exists, askMenu} from "../util.ts";
import {USD, M_IRT, BTC, ETH, LTC, ADA, DOGE, DASH} from "../lib/Coin.ts";

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

export const showRatePage = async () => await askMenu(
  "Rates Page", [
	{title: "exit RATES page"},
	{title: "fetch remote rates", action: () => calculateRates({forceRemote: true, log: true})},
  ], () => {
	console.table({M_IRT, USD, BTC, ETH, LTC, ADA, DOGE, DASH});
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
