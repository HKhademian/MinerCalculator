import { newProduct, Product } from "../lib/Product.ts";

export const hamyar_5th = newProduct({
  id: "hamyar_5th",
  company: "hamyar",
  life: 30 * 6, /*days*/
  price: 0.0010689189745768173, //{ value: 1500.0, coin: "kIRT" },
  power: 5.0,
  efficiency: 0.51,
});

export const products: Product[] = [hamyar_5th];
