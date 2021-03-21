import {DeepPartial, errVal} from "../util.ts";
import {Coin} from "./Coin.ts";

export interface Product {
  id: string;
  company: string;
  life: number;
  price: number;
  price_coin: Coin;
  mine_coin: Coin;
  mine_power: number;
  mine_efficiency: number;
  minBuyInterval: number;
  minCount: number;
  status: number;
  desc?: string;
}

export const newProduct = (source?: DeepPartial<Product>, base?: Product): Product =>
  ({
	id: source?.id || base?.id || errVal("no id provided"),
	company: source?.company || base?.company || errVal("no company provided"),
	life: source?.life || base?.life || 0,
	price: source?.price || base?.price || -1,
	price_coin: source?.price_coin || base?.price_coin || errVal("please specify price coin"),
	mine_coin: source?.mine_coin || base?.mine_coin || errVal("please specify mine coin"),
	mine_power: source?.mine_power || base?.mine_power || 0,
	mine_efficiency: source?.mine_efficiency || base?.mine_efficiency || 1.0,
	minBuyInterval: source?.minBuyInterval || base?.minBuyInterval || 0,
	minCount: source?.minCount || base?.minCount || 0,
	status: source?.status || base?.status || 0,
	desc: source?.desc || base?.desc,
  }) as Product;
