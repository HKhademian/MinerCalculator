import {DeepPartial, errVal} from "../util.ts";
import {System} from "./System.ts";

export interface Coin {
  id: string;
  title: string;
  sign: string;
  value: number;
  desc: string;
  power_profit: number;
  power_unit: string;
}

export namespace Coin {
  export function findById(coin: string | Coin, system: System): Coin | undefined {
	if (typeof (coin) == 'string') return system?.coins?.find(it => it.id == coin);
	return coin as Coin;
  }
}

export const newCoin = (source?: DeepPartial<Coin>): Coin => ({
  id: source?.id || "unknown",
  title: source?.title || "Unknown",
  sign: source?.sign || "Unknown",
  value: source?.value || 0.0,
  desc: source?.desc || "",
  power_profit: source?.power_profit || 0.0,
}) as Coin;

export const exchange = (value: number, fromCoin: string | Coin, targetCoin: string | Coin, system?: System) => {
  const from: Coin = Coin.findById(fromCoin, system!) || errVal("cannot found from-coin in system");
  const target: Coin = Coin.findById(targetCoin, system!) || errVal("cannot found target-coin in system");
  return value / from.value * target.value;
};

export const USDT = newCoin({
  id: "usdt",
  title: "Tether",
  sign: "$",
  value: 1.0,
  desc: "",
});

export const mIRT = newCoin({
  id: "m_irt",
  title: "1m IR Toman",
  sign: "M-Toman",
  value: 25365 / 1000_000,
  desc: "",
});

export const uBTC = newCoin({
  id: "u_btc",
  title: "micro Bitcoin",
  sign: "μɃ", // sign: "μBTC",
  value: 17.83151642068684,
  desc: "",
  power_profit: 5.748, // https://www.cryptocompare.com/mining/calculator/btc?HashingPower=1000000&HashingUnit=TH%2Fs&PowerConsumption=0&CostPerkWh=0&MiningPoolFee=1
  power_unit: "TH/s",
});

export const mETH = newCoin({
  id: "m_eth",
  title: "mili ETH",
  sign: "mΞ", // sign: "mETH",
  value: 0.5643818607669949,
  desc: "",
  power_profit: 56.36, // https://www.cryptocompare.com/mining/calculator/eth?HashingPower=1000&HashingUnit=GH%2Fs&PowerConsumption=1000&CostPerkWh=0&MiningPoolFee=1
  power_unit: "GH/s",
});

export const mDASH = newCoin({
  id: "m_dash",
  title: "mili DASH",
  sign: "mDASH",
  value: 0.22051,
  desc: "",
  power_profit: 0.1346, // https://www.cryptocompare.com/mining/calculator/dash?HashingPower=1000&HashingUnit=GH%2Fs&PowerConsumption=0&CostPerkWh=0.12&MiningPoolFee=1
  power_unit: "GH/s",
});
