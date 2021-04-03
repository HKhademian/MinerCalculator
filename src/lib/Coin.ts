import {System} from "./System.ts";
import {DeepPartial, errVal, generateID, toPrec} from "../util.ts";

export namespace Coin {
  type CoinData = {
	id: string;
	title: string;
	sign: string;
	value: number;
	prec: number;
	desc: string;
	powerProfit: number;
	powerUnit: string;
  };

  export interface Coin extends CoinData {
  }

  export const findById = async (coin: string | Coin, system: System): Promise<Coin | undefined> =>
	typeof coin != "string" ? coin :
	  system?.coins?.find(it => it.id == coin);

  export const create = async (data?: DeepPartial<CoinData>, base?: Coin, system?: System): Promise<Coin> => {
	const coin = ({
	  id: data?.id || base?.id || generateID(),
	  title: data?.title || base?.title || "???",
	  sign: data?.sign || base?.sign || "???",
	  value: data?.value || base?.value || 0.0,
	  prec: data?.prec || base?.prec || 0.0,
	  desc: data?.desc || base?.desc || undefined,
	  powerProfit: data?.powerProfit || base?.powerProfit || 0.0,
	  powerUnit: data?.powerUnit || base?.powerUnit || '???',
	}) as Coin;
	system?.coins.push(coin);
	return coin;
  };

  export const valueStr = async (value: number, valueCoin: Coin | string, prec: number = -1, system?: System): Promise<string> => {
	const coin = await findById(valueCoin, system!) || errVal("coin not found");
	prec = prec >= 0 ? prec : (coin.prec || 0);
	// return `${toPrec(value, prec)} ${coin.sign}`;
	return `${toPrec(value, prec).toFixed(prec)} ${coin.sign}`;
  }

  export const toStr = async (value: number, from: Coin | string, targets: (Coin | string) | (Coin | string)[], prec: number = -1, system?: System): Promise<string> => {
	const fromCoin: Coin = await findById(from, system!) || errVal("coin not found");
	const targetCoins: Coin[] = await (Array.isArray(targets) ? targets : [targets]).mapAwait(async it => await findById(it, system!) || errVal("coin not found"));
	const valuesString = await targetCoins.mapAwait(async coin => await valueStr(await exchange(value, fromCoin, coin, system), coin, prec, system!));
	return valuesString.join(" = ");
  }

  export const exchange = async (value: number, from: string | Coin, target: string | Coin, system?: System): Promise<number> => {
	const fromCoin: Coin = await Coin.findById(from, system!) || errVal(`cannot found from-coin (${from}) in system`);
	const targetCoin: Coin = await Coin.findById(target, system!) || errVal(`cannot found target-coin (${target}) in system`);
	return value / fromCoin.value * targetCoin.value;
  };

}

export type Coin = Coin.Coin;
export const exchange = Coin.exchange;


export const USD = await Coin.create({
  id: "usd",
  title: "US Dollar",
  sign: "$",
  value: 52_507, // https://arzdigital.com/coins/bitcoin/
  prec: 2,
  desc: "",
});

export const M_IRT = await Coin.create({
  id: "m_irt",
  title: "1m IR Toman",
  sign: "╦",
  value: 1_445.794_838, // https://arzdigital.com/coins/bitcoin/
  prec: 3,
  desc: "",
});

export const BTC = await Coin.create({
  id: "btc",
  title: "Bitcoin",
  sign: "Ƀ",
  value: 1.0,
  prec: 5,
  desc: "",
  powerProfit: 0.00000583, // https://www.cryptocompare.com/mining/calculator/btc?HashingPower=1&HashingUnit=TH%2Fs&PowerConsumption=0&CostPerkWh=0&MiningPoolFee=1
  powerUnit: "TH/s",
});

export const ETH = await Coin.create({
  id: "eth",
  title: "ETH",
  sign: "Ξ",
  value: 33.15, // https://arzdigital.com/coins/calculator/?convert=1-BTC-to-ETH
  prec: 3,
  desc: "",
  powerProfit: 0.00005858, // https://www.cryptocompare.com/mining/calculator/eth?HashingPower=1&HashingUnit=MH%2Fs&PowerConsumption=0&CostPerkWh=0&MiningPoolFee=1
  powerUnit: "MH/s",
});

export const LTC = await Coin.create({
  id: "ltc",
  title: "LiteCoin",
  sign: "Ł",
  value: 297.05, // https://arzdigital.com/coins/calculator/?convert=1-BTC-to-LTC
  prec: 3,
  desc: "",
  powerUnit: "GH/s",
  powerProfit: 0.02431, // https://www.cryptocompare.com/mining/calculator/ltc?HashingPower=1&HashingUnit=GH%2Fs&PowerConsumption=0&CostPerkWh=0&MiningPoolFee=1
});

export const ADA = await Coin.create({
  id: "ada",
  title: "Cardano(ADA)",
  sign: "ADA",
  value: 47_816.25, // https://arzdigital.com/coins/calculator/?convert=1-BTC-to-ADA
  prec: 2,
  desc: "",
});

export const DOGE = await Coin.create({
  id: "doge",
  title: "DOGE",
  sign: "DOGE",
  value: 52_644.01, // https://arzdigital.com/coins/calculator/?convert=1-BTC-to-DOGE
  prec: 1,
  desc: "",
});

export const DASH = await Coin.create({
  id: "dash",
  title: "DASH",
  sign: "DASH",
  value: 277.97, // https://arzdigital.com/coins/calculator/?convert=1-BTC-to-DASH
  prec: 2,
  desc: "",
  powerProfit: 0.09940, // https://www.cryptocompare.com/mining/calculator/dash?HashingPower=1&HashingUnit=TH%2Fs&PowerConsumption=0&CostPerkWh=0&MiningPoolFee=1
  powerUnit: "TH/s",
});

export const BASE_COINS = [M_IRT, USD, BTC, ETH, LTC, ADA, DOGE, DASH];
