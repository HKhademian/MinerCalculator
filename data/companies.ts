import { exchange } from "../lib/Coin.ts";
import { kIRT, uBTC } from "../data/coins.ts";
import { newProduct, Product } from "../lib/Product.ts";

export const hamyar_5th_6m = newProduct({
  id: "hamyar_5th_6m",
  company: "hamyar",
  life: 30 * 6, /*days*/
  price: exchange(1500, kIRT, uBTC),
  power: 5.0,
  efficiency: 0.51,
});

export const hamyar_5th_12m = newProduct({
  id: "hamyar_5th_12m",
  company: "hamyar",
  life: 30 * 12, /*days*/
  price: exchange(2500, kIRT, uBTC),
  power: 5.0,
  efficiency: 0.51,
});

export const pishtaz_4th_12m = newProduct({
  id: "pishtaz_5th_12m",
  company: "pishtaz",
  life: 30 * 12, /*days*/
  price: exchange(1800, kIRT, uBTC),
  power: 4.0,
  efficiency: 0.50,
});

// export const products: Product[] = [hamyar_5th_6m, hamyar_5th_12m];
export const products: Product[] = [pishtaz_4th_12m];
