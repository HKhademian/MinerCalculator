import {DeepPartial, errVal, generateID} from "../util.ts";
import {Coin, exchange} from "./Coin.ts";
import {Product} from "./Product.ts";
import {Company, Source} from "./Source.ts";
import {System} from "./System.ts";
import {User} from "./User.ts";
import {Wallet} from "./Wallet.ts";

export namespace Worker {
  export type Owner = { [userId: string]: number };
  type OwnerData = string | User | Owner;

  type PurchaseDetailData = {
	type: 'buy' | 'reinvest';
	company: string | Company;
	product: string | Product;
	factor: string;
	count: number;
	price: number;
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

  export const findById = async (worker: string | Worker, system: System): Promise<Worker | undefined> =>
	typeof (worker) != "string" ? worker : system?.workers.find(it => it.id == worker);

  const newPurchaseDetail = (data?: DeepPartial<PurchaseDetailData>, base?: PurchaseDetail): PurchaseDetail => {
	const company = data?.company || base?.company || errVal("no company provided");
	const product = data?.product || base?.product || errVal("no product provided");
	const priceCoin = data?.priceCoin || base?.priceCoin || errVal("no priceCoin provided");
	return ({
	  type: data?.type || base?.type || 'buy',
	  company: typeof company == "string" ? company : company.id,
	  product: typeof product == "string" ? product : product.id,
	  factor: data?.factor || base?.factor || "UNKNOWN",
	  count: data?.count || base?.count || 0,
	  price: data?.price || base?.price || 0,
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


  export const create = async (data?: DeepPartial<WorkerData>, base?: Worker, system?: System): Promise<Worker> => {
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

  export const createWorkerFromProduct = async (
	{source, product, owners, purchase, startTime, count}: {
	  source: string | Source;
	  product?: string | Product;
	  owners: OwnerData;
	  startTime?: number;
	  count?: number;
	  purchase?: DeepPartial<PurchaseDetailData>;
	},
	system?: System,
  ): Promise<Worker> => {
	const productCount = (count || purchase?.count || 0);

	product = await Product.findById(product || purchase?.product || "", system!) || errVal("no product found");

	source = await Source.findById(source, system!) || errVal("no source found");

	product.company == source.company || errVal("source/product company not match");
	!purchase?.company || product.company == purchase.company || errVal("purchase/product company not match");

	return await create({
	  owners, source,
	  coin: product.mineCoin,
	  power: product.minePower * productCount,
	  efficiency: product.mineEfficiency,
	  startTime: startTime || 0,
	  endTime: (startTime || 0) + product.life,

	  purchase: {
		product,
		company: product.company,
		factor: purchase?.factor || "???",
		count: productCount,
		price: purchase?.price || product.price * productCount,
		priceCoin: purchase?.priceCoin || product.priceCoin,
		date: purchase?.date || "???",
		life: product.life,
		type: purchase?.type || 'buy',
	  },

	  desc: `Buy ${count} worker from product(${product.id})`,
	}, undefined, system);
  }

  export const buyWorkerFromProduct = async (
	{source, product, owners, startDay = 0, money, moneyCoin, purchase}: {
	  source: string | Source;
	  product: string | Product;
	  owners: OwnerData;
	  startDay?: number;
	  money: number;
	  moneyCoin?: Coin | string;
	  purchase?: DeepPartial<PurchaseDetailData>;
	},
	system?: System,
  ): Promise<Worker> => {
	product = await Product.findById(product, system!) || errVal("no product found");
	const moneyEq = await exchange(money, moneyCoin || product.priceCoin, product.priceCoin, system);
	const count = Math.floor(moneyEq / product.price);
	return await createWorkerFromProduct({source, product, owners, startTime: startDay, count, purchase}, system);
  };


  export const reinvestWorkerFromProduct = async (
	{
	  source: reqSource,
	  product: reqProduct,
	  owners: reqOwners,
	  count: reqCount,
	  money: reqMoney,
	  startTime,
	  moneyCoin,
	  purchase,
	}: {
	  source: string | Source;
	  product: string | Product;
	  owners?: OwnerData;
	  startTime?: number;
	  count?: number;
	  money?: number;
	  moneyCoin?: Coin | string;
	  purchase?: DeepPartial<PurchaseDetailData>;
	},
	system: System,
  ): Promise<Worker> => {
	startTime = startTime || system.currentTime;
	const source = typeof reqSource == "string" ? reqSource : reqSource.id;
	const owners = reqOwners || await Source.getOwnerShares(system, source, startTime);

	const product = await Product.findById(reqProduct, system) || errVal("no product found");

	const count = reqCount || (reqMoney && Math.floor(await exchange(reqMoney, moneyCoin || product.priceCoin, product.priceCoin, system) / product.price)) || errVal("must provide count or money");

	const worker = await createWorkerFromProduct({
	  product, startTime, count, owners, source, purchase: {
		type: purchase?.type || 'reinvest',
		factor: purchase?.factor,
		date: purchase?.date,
	  },
	}, system);

	const coin = worker.coin;
	const cost = await exchange(count * product.price, product.priceCoin, product.mineCoin, system);

	const liveWallet = (await Wallet.find({source, coin, type: 'live'}, system))!;
	liveWallet.value -= cost;
	//TODO: add transaction data

	Object.entries(worker.owners).forEachAwait(async ([ownerId, ownerShare]) => {
	  const shareCost = ownerShare * cost;
	  const workingWallet = (await Wallet.find({source, coin, user: ownerId, type: 'working'}, system))!;
	  const savingWallet = (await Wallet.find({source, coin, user: ownerId, type: 'saving'}, system))!;

	  workingWallet.value -= shareCost;
	  if (workingWallet.value < 0) {
		savingWallet.value -= -workingWallet.value;
		workingWallet.value = 0;
	  }
	  if (savingWallet.value < 0) {
		workingWallet.value = savingWallet.value;
		savingWallet.value = 0;
	  }
	  //TODO: add transaction data
	});

	return worker;
  };


}

export type Worker = Worker.Worker;
