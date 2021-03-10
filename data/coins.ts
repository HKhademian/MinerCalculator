import { Coin, newCoin } from "../lib/Coin.ts";

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
  value: 17.848556426604773,
  desc: "",
});

export const mETH = newCoin({
  id: "m_eth",
  title: "mETH",
  value: 1.846550,
  desc: "",
});

export const kIRT = newCoin({
  id: "k_irt",
  title: "kToman",
  value: 24.980,
  desc: "",
});

export const coins: Coin[] = [USDT, uBTC, mETH, kIRT];
