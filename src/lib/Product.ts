import {System} from "./System.ts";
import {Coin} from "./Coin.ts";
import {Company} from "./Source.ts";
import {DeepPartial, errVal} from "../util.ts";

export namespace Product {
  type ProductData = {
	id: string;
	company: string | Company;
	life: number;
	price: number;
	priceCoin: string | Coin;
	mineCoin: string | Coin;
	minePower: number;
	mineEfficiency: number;
	status: number;
	desc?: string;
  };

  export interface Product extends ProductData {
	company: string;
	priceCoin: string;
	mineCoin: string;
  }

  export const findAll = async (cond: { product?: string | Product, company?: string | Company, mineCoin?: string | Coin }, system: System): Promise<Product[]> => {
	let products = system?.products || [];
	if (cond.product) {
	  const product = (typeof (cond.product) == "string") ? products.find(it => it.id == cond.product) : cond.product;
	  return product ? [product] : [];
	}
	if (cond.company) {
	  const companyId = typeof (cond.company) == "string" ? cond.company : cond.company.id;
	  products = products.filter(it => it.company == companyId);
	}
	if (cond.mineCoin) {
	  const mineCoinId = typeof (cond.mineCoin) == "string" ? cond.mineCoin : cond.mineCoin.id;
	  products = products.filter(it => it.mineCoin == mineCoinId);
	}
	if (cond.mineCoin) {
	  const mineCoinId = typeof (cond.mineCoin) == "string" ? cond.mineCoin : cond.mineCoin.id;
	  products = products.filter(it => it.mineCoin == mineCoinId);
	}
	return products;
  };

  export const findById = async (product: string | Product, system: System): Promise<Product | undefined> =>
	typeof (product) != "string" ? product : system?.products.find(it => it.id == product);

  export const create = async (data?: DeepPartial<ProductData>, base?: Product, system?: System): Promise<Product> => {
	const company = data?.company || base?.company || errVal("no company provided");
	const priceCoin = data?.priceCoin || base?.priceCoin || errVal("no priceCoin provided");
	const mineCoin = data?.mineCoin || base?.mineCoin || errVal("no mineCoin provided");
	const product = ({
	  id: data?.id || base?.id || errVal("no id provided"),
	  company: typeof company == "string" ? company : company.id,
	  life: data?.life || base?.life || 0,
	  price: data?.price || base?.price || -1,
	  priceCoin: typeof priceCoin == "string" ? priceCoin : priceCoin.id,
	  mineCoin: typeof mineCoin == "string" ? mineCoin : mineCoin.id,
	  minePower: data?.minePower || base?.minePower || 0,
	  mineEfficiency: data?.mineEfficiency || base?.mineEfficiency || 1.0,
	  status: data?.status || base?.status || 0,
	  desc: data?.desc || base?.desc,
	}) as Product;
	system?.products.push(product);
	return product;
  };

}

export type Product = Product.Product;
