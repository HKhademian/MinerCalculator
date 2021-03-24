import {DeepPartial, errVal, generateID, uuid} from "../util.ts";
import {Coin, exchange} from "./Coin.ts";
import {Product} from "./Product.ts";
import {Source} from "./Source.ts";
import {System} from "./System.ts";

interface PurchaseDetail {
  type: 'buy' | 'reinvest';
  company: string;
  product: string;
  factor: string;
  productCount: number;
  sumPrice: number;
  priceCoin: string;
  date: string;
  life: number;
  // userIds: { [key: string]: number };
}

export interface Worker {
  id: string;
  source: string;
  owners: string | { [key: string]: number };
  coin: string;
  power: number;
  efficiency: number;
  startTime: number;
  endTime: number;
  purchase: PurchaseDetail,
  desc?: string;
}

export namespace Worker {
  export function findById(worker: string | Worker, system: System): Worker | undefined {
	if (typeof (worker) != "string") return worker as Worker;
	return system?.workers.find(it => it.id == worker);
  }

  const newPurchaseDetail = (source?: DeepPartial<PurchaseDetail>, base?: PurchaseDetail): PurchaseDetail => ({
	type: source?.type || base?.type || 'buy',
	company: source?.company || base?.company || errVal("no company specified"),
	product: source?.product || base?.product || errVal("no product specified"),
	factor: source?.factor || base?.factor || "UNKNOWN",
	productCount: source?.productCount || base?.productCount || 0,
	sumPrice: source?.sumPrice || base?.sumPrice || 0,
	priceCoin: source?.priceCoin || base?.priceCoin || errVal("no coin specified"),
	date: source?.date || base?.date || 0,
	life: source?.life || base?.life || 0,
  }) as PurchaseDetail;


  export const newWorker = (source?: DeepPartial<Worker>, base?: Worker, system?: System): Worker => {
	const worker = ({
	  id: source?.id || generateID(),
	  source: source?.source || base?.source || errVal("no source-id specified"),
	  owners: JSON.parse(JSON.stringify(source?.owners || base?.owners || errVal("no owner specified"))),
	  coin: source?.coin || base?.coin || errVal("no coin provided"),
	  power: source?.power || 0,
	  efficiency: source?.efficiency || 1.0,
	  startTime: source?.startTime || base?.startTime || 0,
	  endTime: source?.endTime || base?.endTime || 0,
	  purchase: newPurchaseDetail(source?.purchase, base?.purchase),
	  desc: source?.desc,
	}) as Worker;
	system?.workers.push(worker);
	return worker;
  }

  export const newWorkerFromProduct = (
	{source, product, owners, purchase, start_day = 0, count = 0}: {
	  source: Source;
	  product: Product;
	  owners: string | { [_: string]: number };
	  start_day?: number | undefined;
	  count?: number | undefined;
	  purchase?: DeepPartial<PurchaseDetail> | undefined;
	},
	system?: System,
  ): Worker => newWorker({
	source: source.id,
	coin: product.mineCoinId,
	power: product.minePower * count,
	owners,
	efficiency: product.mineEfficiency,
	startTime: start_day || 0,
	endTime: (start_day || 0) + product.life,

	purchase: {
	  company: product.companyId,
	  product: product.id,
	  factor: purchase?.factor || "???",
	  productCount: count,
	  sumPrice: product.price * count,
	  priceCoin: product.priceCoinId,
	  date: purchase?.date || "???",
	  life: product.life,
	},

	desc: `Buy ${count} worker from product(${product.id})`,
  }, undefined, system);

  export const buyWorkerFromProduct = (
	{source, product, owners, start_day = 0, money, moneyCoin}: {
	  source: Source;
	  product: Product;
	  owners: { [_: string]: number };
	  start_day?: number | undefined;
	  money: number;
	  moneyCoin: Coin | string | undefined;
	},
	system?: System,
  ): Worker => {
	const moneyEq = exchange(money, moneyCoin || product.priceCoinId, product.priceCoinId, system);
	const count = Math.floor(moneyEq / product.price);
	return newWorkerFromProduct({source, product, owners, start_day, count}, system);
  };

}
