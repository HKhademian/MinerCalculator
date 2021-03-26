import {System} from "./System.ts";
import {DeepPartial, errVal, toPrec} from "../util.ts";

export interface Coin {
  id: string;
  title: string;
  sign: string;
  value: number;
  desc: string;
  powerProfit: number;
  powerUnit: string;
}

export namespace Coin {
  export function findById(coin: string | Coin, system: System): Coin | undefined {
	if (typeof (coin) == 'string') return system?.coins?.find(it => it.id == coin);
	return coin as Coin;
  }

  export const create = (source?: DeepPartial<Coin>, base?: Coin, system?: System): Coin => {
	const coin = ({
	  id: source?.id || "unknown",
	  title: source?.title || "Unknown",
	  sign: source?.sign || "Unknown",
	  value: source?.value || 0.0,
	  desc: source?.desc || "",
	  powerProfit: source?.powerProfit || 0.0,
	}) as Coin;
	system?.coins.push(coin);
	return coin;
  };

  export const valueStr = (value: number, valueCoin: Coin | string, prec: number = 3, system: System): string => {
	const coin = findById(valueCoin, system!)!;
	return `${toPrec(value, prec)} ${coin.sign}`;
  }

  export const toString = (value: number, from: Coin | string, to: (Coin | string) | (Coin | string)[], prec: number = 3, system: System): string => {
	const fromCoin: Coin = findById(from, system)!;
	const targets: Coin[] = (Array.isArray(to) ? to : [to]).map(it => findById(it, system)!);
	const valuesString = targets.map(coin => valueStr(exchange(value, fromCoin, coin, system), coin, prec, system));
	return valuesString.join(" = ");
  }
}

export const exchange = (value: number, fromCoin: string | Coin, targetCoin: string | Coin, system?: System): number => {
  const from: Coin = Coin.findById(fromCoin, system!) || errVal(`cannot found from-coin (${fromCoin}) in system`);
  const target: Coin = Coin.findById(targetCoin, system!) || errVal(`cannot found target-coin (${targetCoin}) in system`);
  return value / from.value * target.value;
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
  sign: "M-Toman",
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
