import {DeepPartial, errVal} from "../util.ts";
import {Coin} from "./Coin.ts";
import {Company} from "./Source.ts";
import {System} from "./System.ts";

export interface Product {
  id: string;
  companyId: string;
  life: number;
  price: number;
  priceCoinId: string;
  mineCoinId: string;
  minePower: number;
  mineEfficiency: number;
  limits: {
	minBuyInterval: number;
	minCount: number;
	reInvest: boolean;
  };
  status: number;
  desc?: string;
}

export namespace Product {
  export const findAll = (cond: { product?: Product | string, company?: Company | string, mineCoin?: Coin | string }, system: System): Product[] => {
	let products = system?.products || [];
	if (cond.product) {
	  const product = (typeof (cond.product) == "string") ? products.find(it => it.id == cond.product) : cond.product;
	  return product ? [product] : [];
	}
	if (cond.company) {
	  const companyId = typeof (cond.company) == "string" ? cond.company : cond.company.id;
	  products = products.filter(it => it.companyId == companyId);
	}
	if (cond.mineCoin) {
	  const mineCoinId = typeof (cond.mineCoin) == "string" ? cond.mineCoin : cond.mineCoin.id;
	  products = products.filter(it => it.mineCoinId == mineCoinId);
	}
	if (cond.mineCoin) {
	  const mineCoinId = typeof (cond.mineCoin) == "string" ? cond.mineCoin : cond.mineCoin.id;
	  products = products.filter(it => it.mineCoinId == mineCoinId);
	}
	return products;
  };

  export const findById = (product: Product | string, system: System): Product | undefined => {
	if (typeof (product) != "string") return product;
	return system.products.find(it => it.id == product);
  }

  export const newProduct = (source?: DeepPartial<Product>, base?: Product, system?: System): Product => {
	const product = ({
	  id: source?.id || base?.id || errVal("no id provided"),
	  companyId: source?.companyId || base?.companyId || errVal("no company-id provided"),
	  life: source?.life || base?.life || 0,
	  price: source?.price || base?.price || -1,
	  priceCoinId: source?.priceCoinId || base?.priceCoinId || errVal("no price-coin-id provided"),
	  mineCoinId: source?.mineCoinId || base?.mineCoinId || errVal("no mine-coin-id provided"),
	  minePower: source?.minePower || base?.minePower || 0,
	  mineEfficiency: source?.mineEfficiency || base?.mineEfficiency || 1.0,
	  limits: {
		minBuyInterval: source?.limits?.minBuyInterval || base?.limits?.minBuyInterval || 0,
		minCount: source?.limits?.minCount || base?.limits?.minCount || 0,
		reInvest: source?.limits?.reInvest || base?.limits?.reInvest || false,
	  },
	  status: source?.status || base?.status || 0,
	  desc: source?.desc || base?.desc,
	}) as Product;
	system?.products.push(product);
	return product;
  };

}
