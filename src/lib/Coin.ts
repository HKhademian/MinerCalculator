import {System} from "./System.ts";
import {DeepPartial, errVal, generateID, toPrec} from "../util.ts";

export namespace Coin {
  type CoinData = {
	id: string;
	title: string;
	sign: string;
	value: number;
	desc: string;
	powerProfit: number;
	powerUnit: string;
  };

  export interface Coin extends CoinData {
  }

  export function findById(coin: string | Coin, system: System): Coin | undefined {
	if (typeof (coin) == 'string') return system?.coins?.find(it => it.id == coin);
	return coin as Coin;
  }

  export const create = (data?: DeepPartial<CoinData>, base?: Coin, system?: System): Coin => {
	const coin = ({
	  id: data?.id || base?.id || generateID(),
	  title: data?.title || base?.title || "???",
	  sign: data?.sign || base?.sign || "???",
	  value: data?.value || base?.value || 0.0,
	  desc: data?.desc || base?.desc || undefined,
	  powerProfit: data?.powerProfit || base?.powerProfit || 0.0,
	  powerUnit: data?.powerUnit || base?.powerUnit || '???',
	}) as Coin;
	system?.coins.push(coin);
	return coin;
  };

  export const valueStr = (value: number, valueCoin: Coin | string, prec: number = 3, system?: System): string => {
	const coin = findById(valueCoin, system!)!;
	return `${toPrec(value, prec)} ${coin.sign}`;
  }

  export const toString = (value: number, from: Coin | string, targets: (Coin | string) | (Coin | string)[], prec: number = 3, system?: System): string => {
	const fromCoin: Coin = findById(from, system!)!;
	const targetCoins: Coin[] = (Array.isArray(targets) ? targets : [targets]).map(it => findById(it, system!)!);
	const valuesString = targetCoins.map(coin => valueStr(exchange(value, fromCoin, coin, system), coin, prec, system!));
	return valuesString.join(" = ");
  }

  export const exchange = (value: number, from: string | Coin, target: string | Coin, system?: System): number => {
	const fromCoin: Coin = Coin.findById(from, system!) || errVal(`cannot found from-coin (${from}) in system`);
	const targetCoin: Coin = Coin.findById(target, system!) || errVal(`cannot found target-coin (${target}) in system`);
	return value / fromCoin.value * targetCoin.value;
  };

  export const USD = Coin.create({
	id: "usd",
	title: "US Dollar",
	sign: "$",
	value: 52_507, // https://arzdigital.com/coins/bitcoin/
	desc: "",
  });

  export const M_IRT = Coin.create({
	id: "m_irt",
	title: "1m IR Toman",
	sign: "╦",
	value: 1_445.794_838, // https://arzdigital.com/coins/bitcoin/
	desc: "",
  });

  export const BTC = Coin.create({
	id: "btc",
	title: "Bitcoin",
	sign: "Ƀ",
	value: 1.0,
	desc: "",
	powerProfit: 0.00000583, // https://www.cryptocompare.com/mining/calculator/btc?HashingPower=1&HashingUnit=TH%2Fs&PowerConsumption=0&CostPerkWh=0&MiningPoolFee=1
	powerUnit: "TH/s",
  });

  export const ETH = Coin.create({
	id: "eth",
	title: "ETH",
	sign: "Ξ",
	value: 33.15, // https://arzdigital.com/coins/calculator/?convert=1-BTC-to-ETH
	desc: "",
	powerProfit: 0.00005858, // https://www.cryptocompare.com/mining/calculator/eth?HashingPower=1&HashingUnit=MH%2Fs&PowerConsumption=0&CostPerkWh=0&MiningPoolFee=1
	powerUnit: "MH/s",
  });

  export const LTC = Coin.create({
	id: "ltc",
	title: "LiteCoin",
	sign: "Ł",
	value: 297.05, // https://arzdigital.com/coins/calculator/?convert=1-BTC-to-LTC
	desc: "",
	powerUnit: "GH/s",
	powerProfit: 0.02431, // https://www.cryptocompare.com/mining/calculator/ltc?HashingPower=1&HashingUnit=GH%2Fs&PowerConsumption=0&CostPerkWh=0&MiningPoolFee=1
  });

  export const ADA = Coin.create({
	id: "ada",
	title: "Cardano(ADA)",
	sign: "ADA",
	value: 47_816.25, // https://arzdigital.com/coins/calculator/?convert=1-BTC-to-ADA
	desc: "",
  });

  export const DOGE = Coin.create({
	id: "doge",
	title: "DOGE",
	sign: "DOGE",
	value: 52_644.01, // https://arzdigital.com/coins/calculator/?convert=1-BTC-to-DOGE
	desc: "",
  });

  export const DASH = Coin.create({
	id: "dash",
	title: "DASH",
	sign: "DASH",
	value: 277.97, // https://arzdigital.com/coins/calculator/?convert=1-BTC-to-DASH
	desc: "",
	powerProfit: 0.09940, // https://www.cryptocompare.com/mining/calculator/dash?HashingPower=1&HashingUnit=TH%2Fs&PowerConsumption=0&CostPerkWh=0&MiningPoolFee=1
	powerUnit: "TH/s",
  });

  export const BASE_COINS = [M_IRT, USD, BTC, ETH, LTC, ADA, DOGE, DASH];

}

export type Coin = Coin.Coin;
export const exchange = Coin.exchange;
export const M_IRT = Coin.M_IRT;
export const USD = Coin.USD;
export const BTC = Coin.BTC;
export const ETH = Coin.ETH;
export const LTC = Coin.LTC;
export const ADA = Coin.ADA;
export const DOGE = Coin.DOGE;
export const DASH = Coin.DASH;
export const BASE_COINS = Coin.BASE_COINS;
