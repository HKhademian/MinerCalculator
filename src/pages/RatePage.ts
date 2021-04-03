import {exists, askMenu} from "../util.ts";
import {USD, M_IRT, BTC, ETH, LTC, ADA, DOGE, DASH} from "../lib/Coin.ts";
import {Routines} from "../lib/Routines.ts";


export const showRatePage = async () => await askMenu(
  "Rates Page", [
	{title: "exit RATES page"},
	{title: "fetch remote rates", action: () => Routines.calculateRates({forceRemote: true, log: true})},
  ], () => {
	console.table({M_IRT, USD, BTC, ETH, LTC, ADA, DOGE, DASH});
  }, {
	defaultChoice: 0,
  });

