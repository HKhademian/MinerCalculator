import {DeepPartial, errVal, generateID} from "../util.ts";
import {Coin, exchange} from "./Coin.ts";
import {Product} from "./Product.ts";
import {Company, Source} from "./Source.ts";
import {System} from "./System.ts";
import {User} from "./User.ts";

export namespace Worker {
  export type Owner = { [userId: string]: number };
  type OwnerData = string | User | Owner;

  type PurchaseDetailData = {
	type: 'buy' | 'reinvest';
	company: string | Company;
	product: string | Product;
	factor: string;
	productCount: number;
	sumPrice: number;
	priceCoin: string | Coin;
	date: string;
	life: number;
  };

  export interface PurchaseDetail extends PurchaseDetailData {
	company: string;
	product: string;
	priceCoin: string;
  }

  export type WorkerData = {
	id: string;
	source: string | Source;
	owners: OwnerData;
	coin: string | Coin;
	power: number;
	efficiency: number;
	startTime: number;
	endTime: number;
	purchase: PurchaseDetailData;
	desc?: string;
  };

  export interface Worker extends WorkerData {
	source: string;
	owners: Owner;
	coin: string;
	purchase: PurchaseDetail;
  }

  export function findById(worker: string | Worker, system: System): Worker | undefined {
	if (typeof (worker) != "string") return worker as Worker;
	return system?.workers.find(it => it.id == worker);
  }

  const newPurchaseDetail = (data?: DeepPartial<PurchaseDetailData>, base?: PurchaseDetail): PurchaseDetail => {
	const company = data?.company || base?.company || errVal("no company provided");
	const product = data?.product || base?.product || errVal("no product provided");
	const priceCoin = data?.priceCoin || base?.priceCoin || errVal("no priceCoin provided");
	return ({
	  type: data?.type || base?.type || 'buy',
	  company: typeof company == "string" ? company : company.id,
	  product: typeof product == "string" ? product : product.id,
	  factor: data?.factor || base?.factor || "UNKNOWN",
	  productCount: data?.productCount || base?.productCount || 0,
	  sumPrice: data?.sumPrice || base?.sumPrice || 0,
	  priceCoin: typeof priceCoin == "string" ? priceCoin : priceCoin.id,
	  date: data?.date || base?.date || 0,
	  life: data?.life || base?.life || 0,
	}) as PurchaseDetail;
  }

  const newOwners = (source?: DeepPartial<OwnerData>, base?: Owner): Owner | undefined => {
	if (!source && !base) return undefined;
	if (typeof source == "string") return {[source]: 1};
	if (source?.id) return {[source.id]: 1};
	return JSON.parse(JSON.stringify((source as Owner) || base));
  }


  export const create = (data?: DeepPartial<WorkerData>, base?: Worker, system?: System): Worker => {
	const source = data?.source || base?.source || errVal("no source provided");
	const owners = newOwners(data?.owners, base?.owners) || errVal("no owners provided");
	const coin = data?.coin || base?.coin || errVal("no coin provided");

	const worker = ({
	  id: data?.id || generateID(),
	  source: typeof source == "string" ? source : source.id,
	  owners: owners,
	  coin: typeof coin == "string" ? coin : coin.id,
	  power: data?.power || 0,
	  efficiency: data?.efficiency || 1.0,
	  startTime: data?.startTime || base?.startTime || 0,
	  endTime: data?.endTime || base?.endTime || 0,
	  purchase: newPurchaseDetail(data?.purchase, base?.purchase),
	  desc: data?.desc,
	}) as Worker;
	system?.workers.push(worker);
	return worker;
  }

  export const createWorkerFromProduct = (
	{source, product, owners, purchase, startTime = 0, count = 0}: {
	  source: string | Source;
	  product: string | Product;
	  owners: OwnerData;
	  startTime?: number;
	  count?: number;
	  purchase?: DeepPartial<PurchaseDetailData>;
	},
	system?: System,
  ): Worker => {
	product = Product.findById(product, system!) || errVal("no product found");
	return create({
	  owners, source,
	  coin: product.mineCoin,
	  power: product.minePower * count,
	  efficiency: product.mineEfficiency,
	  startTime: startTime || 0,
	  endTime: (startTime || 0) + product.life,

	  purchase: {
		product,
		company: product.company,
		factor: purchase?.factor || "???",
		productCount: count,
		sumPrice: product.price * count,
		priceCoin: product.priceCoin,
		date: purchase?.date || "???",
		life: product.life,
		type: purchase?.type || 'buy',
	  },

	  desc: `Buy ${count} worker from product(${product.id})`,
	}, undefined, system);
  }

  export const buyWorkerFromProduct = (
	{source, product, owners, startDay = 0, money, moneyCoin}: {
	  source: string | Source;
	  product: string | Product;
	  owners: OwnerData;
	  startDay?: number | undefined;
	  money: number;
	  moneyCoin: Coin | string | undefined;
	},
	system?: System,
  ): Worker => {
	product = Product.findById(product, system!) || errVal("no product found");
	const moneyEq = exchange(money, moneyCoin || product.priceCoin, product.priceCoin, system);
	const count = Math.floor(moneyEq / product.price);
	return createWorkerFromProduct({source, product, owners, startTime: startDay, count}, system);
  };


}

export type Worker = Worker.Worker;
