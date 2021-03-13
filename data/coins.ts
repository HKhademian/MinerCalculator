import {Coin, exchange, newCoin} from "../lib/Coin.ts";

export type {Coin};
export {exchange};

export const USDT = newCoin({
	id: "usdt",
	title: "Tether",
	sign: "$",
	value: 1.0,
	desc: "",
});

export const uBTC = newCoin({
	id: "u_btc",
	title: "micro Bitcoin",
	sign: "μBTC",
	value: 0.000017624384534461577 * 1_000_000,
	desc: "",
});

export const mETH = newCoin({
	id: "m_eth",
	title: "micro ETH",
	sign: "mETH",
	value: 1.846550,
	desc: "",
});

export const kIRT = newCoin({
	id: "k_irt",
	title: "1k IR Toman",
	sign: "kToman",
	value: 25.266,
	desc: "",
});

export const coins: Coin[] = [USDT, uBTC, mETH, kIRT];
