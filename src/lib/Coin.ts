import {DeepPartial} from "../util.ts";

export interface Coin {
  id: string;
  title: string;
  sign: string;
  value: number;
  desc: string;
  power_profit: number;
  power_unit: string;
}

export const newCoin = (source?: DeepPartial<Coin>) =>
  ({
	id: source?.id || "unknown",
	title: source?.title || "Unknown",
	sign: source?.sign || "Unknown",
	value: source?.value || 0.0,
	desc: source?.desc || "",
	power_profit: source?.power_profit || 0.0,
  }) as Coin;

export const exchange = (value: number, fromCoin: Coin, toCoin: Coin) => {
  return value / fromCoin.value * toCoin.value;
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
  power_profit: 5.83, // https://www.cryptocompare.com/mining/calculator/btc?HashingPower=1000000&HashingUnit=TH%2Fs&PowerConsumption=0&CostPerkWh=0&MiningPoolFee=1
  power_unit: "TH/s",
});

export const mETH = newCoin({
  id: "m_eth",
  title: "micro ETH",
  sign: "mΞ", // sign: "mETH",
  value: 0.5643818607669949,
  desc: "",
  power_profit: 56.52, // https://www.cryptocompare.com/mining/calculator/eth?HashingPower=1000&HashingUnit=GH%2Fs&PowerConsumption=1000&CostPerkWh=0&MiningPoolFee=1
  power_unit: "GH/s",
});
