import {DeepPartial, errVal} from "../util.ts";
import {Coin, exchange} from "./Coin.ts";
import {Product} from "./Product.ts";

interface PurchaseDetail {
  type: 'buy' | 'reinvest';
  companyId: string;
  productId: string;
  factorId: string;
  productCount: number;
  sumPrice: number;
  priceCoin: Coin;
  date: string;
  life: number;
  // userIds: { [key: string]: number };
}

export interface Worker {
  owners: { [key: string]: number };
  coin: Coin;
  power: number;
  efficiency: number;
  startTime: number;
  endTime: number;
  purchase: PurchaseDetail,
  desc?: string;
}


const newPurchaseDetail = (source?: DeepPartial<PurchaseDetail>, base?: PurchaseDetail): PurchaseDetail => ({
  type: source?.type || base?.type || 'buy',
  companyId: source?.companyId || base?.companyId || errVal("no company specified"),
  productId: source?.productId || base?.productId || errVal("no product specified"),
  factorId: source?.factorId || base?.factorId || "UNKNOWN",
  productCount: source?.productCount || base?.productCount || 0,
  sumPrice: source?.sumPrice || base?.sumPrice || 0,
  priceCoin: source?.priceCoin || base?.priceCoin || errVal("no coin specified"),
  date: source?.date || base?.date || 0,
  life: source?.life || base?.life || 0,
}) as PurchaseDetail;


export const newWorker = (source?: DeepPartial<Worker>, base?: Worker): Worker =>
  ({
	owners: source?.owners && JSON.parse(JSON.stringify(source?.owners)),
	coin: source?.coin || errVal("NO coin"),
	power: source?.power || 0,
	efficiency: source?.efficiency || 1.0,
	startTime: source?.startTime || base?.startTime || 0,
	endTime: source?.endTime || base?.endTime || 0,
	purchase: newPurchaseDetail(source?.purchase, base?.purchase),
	desc: source?.desc,
  }) as Worker;

export const newWorkerFromProduct = (
  {product, owners, purchase, start_day = 0, count = 0}: {
	product: Product;
	owners: { [_: string]: number };
	start_day?: number | undefined;
	count?: number | undefined;
	purchase?: DeepPartial<PurchaseDetail> | undefined;
  },
): Worker =>
  newWorker({
	owners,
	coin: product.mine_coin,
	power: product.mine_power * count,
	efficiency: product.mine_efficiency,
	startTime: start_day || 0,
	endTime: (start_day || 0) + product.life,

	purchase: {
	  companyId: product.company,
	  productId: product.id,
	  factorId: purchase?.factorId || "???",
	  productCount: count,
	  sumPrice: product.price * count,
	  priceCoin: product.price_coin,
	  date: purchase?.date || "???",
	  life: product.life,
	},

	desc: `Buy ${count} worker from product(${product.id})`,
  });

export const buyWorkerFromProduct = (
  {product, owners, start_day = 0, money, money_coin}: {
	product: Product;
	owners: { [_: string]: number };
	start_day?: number | undefined;
	money: number;
	money_coin?: Coin | undefined;
  },
): Worker => {
  const moneyEq = exchange(money, money_coin || product.price_coin, product.price_coin);
  const count = Math.floor(moneyEq / product.price);
  return newWorkerFromProduct({product, owners, start_day, count});
};
