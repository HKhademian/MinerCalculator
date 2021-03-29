import {System, NO_SHARE} from "./lib/System.ts";
import {Company} from "./lib/Source.ts";
import {Product} from "./lib/Product.ts";
import {Source} from "./lib/Source.ts";
import {User, SavePolicy} from "./lib/User.ts";
import {Worker} from "./lib/Worker.ts";
import {Wallet} from "./lib/Wallet.ts";
import {Routines} from "./lib/Routines.ts";
import {Coin, USD, BTC, ETH, M_IRT, LTC, ADA, DOGE, DASH} from "./lib/Coin.ts";
import {askMenu} from "./util.ts";

export const baseSystem: System = System.create({
  managerShare: {
	user: "manager",
	share: 0.09,
  },
  charityShare: {
	user: "home",
	share: 0.01,
  },
});

namespace HossainCo {
  export const COMPANY = Company.create({
	id: 'hossainco',
	title: 'HossainCo',
  }, undefined, baseSystem);

  const BASE_PRODUCT = Product.create({
	id: "hossainco_base",
	company: COMPANY,
	life: 30 * 24,
	priceCoin: USD,
	mineCoin: ETH,
	minePower: 0.0,
	mineEfficiency: 0.90,
  });
  export const prd_30mh_24m = Product.create({
	id: "hossainco_30mh_24m",
	price: 17,
	priceCoin: M_IRT,
	mineCoin: ETH,
	minePower: 30,
	mineEfficiency: 0.75,
  }, BASE_PRODUCT, baseSystem);
  export const prd_32mh_24m = Product.create({
	id: "hossainco_32mh_24m",
	price: 11,
	priceCoin: M_IRT,
	mineCoin: ETH,
	minePower: 32,
	mineEfficiency: 0.50,
  }, BASE_PRODUCT, baseSystem);
  export const prd_rtx570_8gb_24m = Product.create({
	id: "hossainco_rtx570_8gb_24m",
	life: 30 * 12,
	price: 310,
	priceCoin: USD,
	mineCoin: ETH,
	minePower: 30,
	mineEfficiency: 0.90,
	desc: 'https://www.kryptex.org/en/hardware/amd-rx-570-8gb',
  }, BASE_PRODUCT, baseSystem);
  export const prd_rtx580_8gb_24m = Product.create({
	id: "hossainco_rtx580_8gb_24m",
	life: 30 * 12,
	price: 340,
	priceCoin: USD,
	mineCoin: ETH,
	minePower: 32,
	mineEfficiency: 0.90,
	desc: 'https://www.kryptex.org/en/hardware/amd-rx-580-8gb',
  }, BASE_PRODUCT, baseSystem);

  export const SOURCE1 = Source.create({
	id: 'hossainco_src2',
	company: COMPANY,
	reinvest: {product: prd_rtx570_8gb_24m, minCount: 1, minInterval: 1},
	login: 'h.kh',
  }, undefined, baseSystem);
}

namespace Hamyar {
  export const COMPANY = Company.create({
	id: 'hamyar',
	title: 'Hamyar Miner',
  }, undefined, baseSystem);

  export const BASE_PRODUCT_6M = Product.create({
	id: "hamyar_base_6m",
	company: COMPANY,
	life: 30 * 6,
	priceCoin: M_IRT,
	mineCoin: BTC,
	mineEfficiency: 0.51,
  });
  export const BASE_PRODUCT_12M = Product.create({
	id: "hamyar_base_12m",
	life: 30 * 12,
  }, BASE_PRODUCT_6M);
  export const prd_1th_6m_reinvest = Product.create({
	id: "hamyar_1th_6m_reinvest",
	price: 0.355,
	minePower: 1.0,
  }, BASE_PRODUCT_6M, baseSystem);
  export const prd_1th_12m_reinvest = Product.create({
	id: "hamyar_1th_12m_reinvest",
	price: 0.585,
	minePower: 1.0,
  }, BASE_PRODUCT_12M, baseSystem);
  export const prd_13th6_6m = Product.create({
	id: "hamyar_13th6_6m",
	price: 5.100,
	minePower: 13.6,
  }, BASE_PRODUCT_6M, baseSystem);
  export const prd_5th_6m_v1 = Product.create({
	price: 1.5,
	minePower: 5.0,
  }, BASE_PRODUCT_6M);

  export const SOURCE1 = Source.create({
	id: 'hamyar_s1',
	company: COMPANY,
	reinvest: {product: prd_1th_6m_reinvest, minInterval: 2, minCount: 5},
	login: 'h.kh',
  }, undefined, baseSystem);

  export const SOURCE2 = Source.create({
	id: 'hamyar_src2',
	company: COMPANY,
	reinvest: {product: prd_1th_6m_reinvest, minInterval: 3, minCount: 5},
	login: 'hco',
  }, undefined, baseSystem);

  export const SOURCE3 = Source.create({
	id: 'hamyar_src3',
	company: COMPANY,
	reinvest: {product: prd_1th_6m_reinvest, minInterval: 3, minCount: 5},
	login: 'h.kh.74',
  }, undefined, baseSystem);
}

namespace Pishtaz {
  export const COMPANY = Company.create({
	id: 'pishtaz',
	title: 'Pishtaz Miner',
  }, undefined, baseSystem);

  export const BASE_PRODUCT = Product.create({
	id: "pishtaz_base_12m",
	company: COMPANY,
	life: 30 * 12,
	priceCoin: M_IRT,
	mineCoin: BTC,
	mineEfficiency: 0.51,
  });
  export const prd_1th_12m_reinvest = Product.create({
	id: "pishtaz_1th_12m_reinvest",
	price: 0.600,
	minePower: 1.0,
  }, BASE_PRODUCT, baseSystem);
  export const prd_4th_12m_old = Product.create({
	id: "pishtaz_4th_12m",
	price: 1.8,
	minePower: 4.0,
  }, Pishtaz.BASE_PRODUCT);

  export const SOURCE1 = Source.create({
	id: 'pishtaz_s1',
	company: COMPANY,
	login: 'h.kh',
	reinvest: {product: prd_1th_12m_reinvest, minInterval: 3, minCount: 5},
  }, undefined, baseSystem);
}

namespace HashShiny {
  const HASHSHINY = Company.create({
	id: 'hashshiny',
	title: 'Hash Shiny',
  }, undefined, baseSystem);

  const HASHSHINY_BASE = Product.create({
	id: "hashshiny_base",
	company: HASHSHINY,
	life: 30 * 24,
	priceCoin: USD,
	mineCoin: BTC,
	minePower: 0.0,
	mineEfficiency: 0.0,
  });
  export const hashshiny_btc_10gh = Product.create({
	id: "hashshiny_btc_10gh",
	price: 1.05,
	priceCoin: USD,
	mineCoin: BTC,
	minePower: 0.010,
	mineEfficiency: 0.75,
  }, HASHSHINY_BASE, baseSystem);
  export const hashshiny_dash_100mh = Product.create({
	id: "hashshiny_btc_100mh",
	price: 0.89,
	priceCoin: USD,
	mineCoin: DASH,
	minePower: 0.1,
	mineEfficiency: 0.9,
  }, HASHSHINY_BASE, baseSystem);

  export const SOURCE1_BTC = Source.create({
	id: 'hashshiny_s1',
	company: HASHSHINY,
	reinvest: {product: hashshiny_btc_10gh, minCount: 1, minInterval: 1},
	login: 'h.kh',
  }, undefined, baseSystem);
  export const SOURCE1_ETH = Source.create({
	id: 'hashshiny_s2',
	company: HASHSHINY,
	reinvest: {product: hashshiny_dash_100mh, minCount: 1, minInterval: 1},
	login: 'h.kh',
  }, undefined, baseSystem);
}

namespace Hashing24 {
  export const COMPANY = Company.create({
	id: 'hashing24',
	title: 'Hash Shiny',
	link: 'https://hashing24.com/?rid=53616c7465645f5fe55576b18571d7f48310fdf2bb515d30',
  }, undefined, baseSystem);
  export const BASE_PRODUCT_12M = Product.create({
	id: "hashing_base_12m",
	company: COMPANY,
	life: 30 * 12,
	priceCoin: USD,
	mineCoin: BTC,
	mineEfficiency: 1,
  });
  export const prd_host_12m = Product.create({
	price: 10.1,
	minePower: 0.1 * 1.05,
  }, BASE_PRODUCT_12M, baseSystem);

  export const SOURCE1 = Source.create({
	id: 'hashing_src1',
	company: COMPANY,
	reinvest: {product: prd_host_12m, minInterval: 7, minCount: 10},
	login: 'h.kh',
  }, undefined, baseSystem);
}

namespace HashFlare {
  export const COMAPNY = Company.create({
	id: 'hashflare',
	title: 'HashFlare',
	link: 'https://hashflare.io/r/76BC7F2C',
  }, undefined, baseSystem);

}

namespace users {
  const BASE_USER: User = User.create({
	id: "base",
	title: "Base User",
	savePolicy: [/*{
	start: 30 * 6,
	rate: 0.40,
  },*/ {
	  start: 30 * 4,
	  rate: 0.30,
	}, {
	  start: 30 * 2,
	  rate: 0.20,
	}/*, {
	start: 30 * 1,
	rate: 0.10,
  }*/],
  });

  export const manager = User.create({
	id: "manager",
	title: "System Manager",
	savePolicy: {
	  start: 30 * 6,
	  rate: 0.2,
	},
  }, BASE_USER, baseSystem);

  export const charity = User.create({
	id: "charity",
	title: "System Charity Bank",
	savePolicy: {
	  start: 30 * 3,
	  rate: 0.5,
	},
  }, BASE_USER, baseSystem);

  export const hossain = User.create({
	id: "hossain",
	title: "Hossain",
  }, BASE_USER, baseSystem);

  export const mitra = User.create({
	id: "mitra",
	title: "Mitra",
  }, BASE_USER, baseSystem);

  export const ali = User.create({
	id: "ali",
	title: "Ali",
  }, BASE_USER, baseSystem);

  export const saeed = User.create({
	id: "saeed",
	title: "Saeed",
  }, BASE_USER, baseSystem);

  export const zahra = User.create({
	id: "zahra",
	title: "Zahra",
  }, BASE_USER, baseSystem);

  export const fateme = User.create({
	id: "fateme",
	title: "Fateme",
  }, BASE_USER, baseSystem);

  export const home = User.create({
	id: "home",
	title: "Home",
  }, BASE_USER, baseSystem);

  export const sekeZ = User.create({
	id: "sekeZ",
	title: "Seke Zahra",
  }, BASE_USER, baseSystem);

  baseSystem.managerShare!.user = manager.id;
  baseSystem.charityShare!.user = charity.id;
}

namespace workers {
  Worker.createWorkerFromProduct({
	source: Pishtaz.SOURCE1,
	product: Pishtaz.prd_4th_12m_old,
	owners: {[users.hossain.id]: 1},
	startTime: 0,
	count: 1,
	purchase: {factor: "XxXxX", date: "10/12/1399", type: "buy"},
  }, baseSystem);

  Worker.createWorkerFromProduct({
	source: Hamyar.SOURCE1,
	product: Hamyar.prd_5th_6m_v1,
	owners: {[users.hossain.id]: 1},
	startTime: 0,
	count: 1,
	purchase: {factor: "151993", date: "10/12/1399", type: "buy"},
  }, baseSystem);

  Worker.createWorkerFromProduct({
	source: Hamyar.SOURCE1,
	product: Hamyar.prd_5th_6m_v1,
	owners: {[users.ali.id]: 1},
	startTime: 0,
	count: 2,
	purchase: {factor: "152107", date: "10/12/1399", type: "buy"},
  }, baseSystem);

  Worker.createWorkerFromProduct({
	source: Hamyar.SOURCE1,
	product: Hamyar.prd_5th_6m_v1,
	owners: {[users.hossain.id]: 0.75, [users.mitra.id]: 0.25},
	startTime: 1,
	count: 4,
	purchase: {factor: "152326", date: "11/12/1399", type: "buy"},
  }, baseSystem);

  Worker.createWorkerFromProduct({
	source: Hamyar.SOURCE1,
	product: Hamyar.prd_5th_6m_v1,
	owners: {[users.sekeZ.id]: 1},
	startTime: 11,
	count: 10,
	purchase: {factor: "154382", date: "21/12/1399", type: "buy"},
  }, baseSystem);

  Worker.createWorkerFromProduct({
	source: Hamyar.SOURCE1,
	product: Hamyar.prd_1th_6m_reinvest,
	owners: {[users.mitra.id]: 5 / 35, [users.fateme.id]: 30 / 35},
	startTime: 13,
	count: 5,
	purchase: {factor: "154849", date: "23/12/1399", type: "reinvest"},
  }, baseSystem);

  Worker.createWorkerFromProduct({
	source: Hamyar.SOURCE1,
	product: Hamyar.prd_13th6_6m,
	owners: {[users.saeed.id]: 1},
	startTime: 16,
	count: 1,
	purchase: {factor: "155951", date: "26/12/1399", type: "buy"},
  }, baseSystem);

  Worker.createWorkerFromProduct({
	source: Hamyar.SOURCE1,
	product: Hamyar.prd_1th_6m_reinvest,
	owners: {
	  [users.hossain.id]: 0.965 / 5,
	  [users.mitra.id]: 0.276 / 5,
	  [users.ali.id]: 0.483 / 5,
	  [users.saeed.id]: 0.656 / 5,
	  [users.fateme.id]: 0.207 / 5,
	  [users.sekeZ.id]: 2.413 / 5,
	},
	startTime: 17,
	count: 5,
	purchase: {factor: "156208", date: "27/12/1399", type: "reinvest"},
  }, baseSystem);

  Worker.createWorkerFromProduct({
	source: Hamyar.SOURCE1,
	product: Hamyar.prd_13th6_6m,
	owners: {
	  [users.hossain.id]: 9.600 / 27.2,
	  [users.mitra.id]: 6.940 / 27.2,
	  [users.saeed.id]: 2.660 / 27.2,
	  [users.zahra.id]: 8.00 / 27.2,
	},
	startTime: 17,
	count: 2,
	purchase: {factor: "156235", date: "27/12/1399", type: "buy"},
  }, baseSystem);

  Worker.createWorkerFromProduct({
	source: Hamyar.SOURCE1,
	product: Hamyar.prd_13th6_6m,
	owners: {
	  [users.hossain.id]: 0.266 / 13.6,
	  [users.mitra.id]: 13.334 / 13.6,
	},
	startTime: 19,
	count: 1,
	purchase: {factor: "156450", date: "29/12/1399", type: "buy"},
  }, baseSystem);

  Worker.createWorkerFromProduct({
	source: Hamyar.SOURCE1,
	product: Hamyar.prd_13th6_6m,
	owners: {
	  [users.hossain.id]: 1,
	},
	startTime: 19,
	count: 1,
	purchase: {factor: "156451", date: "29/12/1399", type: "buy"},
  }, baseSystem);

  Worker.createWorkerFromProduct({
	source: Hamyar.SOURCE1,
	product: Hamyar.prd_1th_6m_reinvest,
	owners: {
	  [users.hossain.id]: 1.635 / 6,
	  [users.mitra.id]: 0.967 / 6,
	  [users.ali.id]: 0.386 / 6,
	  [users.saeed.id]: 1.929 / 6,
	  [users.zahra.id]: 0.294 / 6,
	  [users.fateme.id]: 0.166 / 6,
	  [users.home.id]: 0 / 6,
	  [users.sekeZ.id]: 0.623 / 6,
	},
	startTime: 20,
	count: 6,
	purchase: {factor: "156643", date: "27/12/1399", type: "reinvest"},
  }, baseSystem);

  Worker.createWorkerFromProduct({
	source: Hamyar.SOURCE1,
	product: Hamyar.prd_13th6_6m,
	owners: {[users.ali.id]: 1},
	startTime: 22,
	count: 1,
	purchase: {factor: "156848", date: "02/01/1400", type: "buy"},
  }, baseSystem);

  Worker.createWorkerFromProduct({
	source: Hamyar.SOURCE1,
	product: Hamyar.prd_1th_6m_reinvest,
	owners: {
	  [users.hossain.id]: 1.766 / 7,
	  [users.mitra.id]: 1.044 / 7,
	  [users.ali.id]: 0.938 / 7,
	  [users.saeed.id]: 0.722 / 7,
	  [users.zahra.id]: 0.318 / 7,
	  [users.fateme.id]: 0.179 / 7,
	  [users.home.id]: 0 / 7,
	  [users.sekeZ.id]: 2.033 / 7,
	},
	startTime: 24,
	count: 7,
	purchase: {factor: "157259", date: "04/01/1400", type: "reinvest"},
  }, baseSystem);

  Worker.createWorkerFromProduct({
	source: Hamyar.SOURCE1,
	product: Hamyar.prd_1th_6m_reinvest,
	owners: {
	  [users.hossain.id]: 1.261 / 5,
	  [users.mitra.id]: 0.746 / 5,
	  [users.ali.id]: 0.670 / 5,
	  [users.saeed.id]: 0.516 / 5,
	  [users.zahra.id]: 0.227 / 5,
	  [users.fateme.id]: 0.128 / 5,
	  [users.home.id]: 0 / 5,
	  [users.sekeZ.id]: 1.452 / 5,
	},
	startTime: 26,
	count: 5,
	purchase: {factor: "157500", date: "06/01/1400", type: "reinvest"},
  }, baseSystem);

  Worker.createWorkerFromProduct({
	source: Hamyar.SOURCE1,
	product: Hamyar.prd_1th_6m_reinvest,
	owners: {
	  [users.hossain.id]: 1.261 / 5,
	  [users.mitra.id]: 0.746 / 5,
	  [users.ali.id]: 0.670 / 5,
	  [users.saeed.id]: 0.516 / 5,
	  [users.zahra.id]: 0.227 / 5,
	  [users.fateme.id]: 0.128 / 5,
	  [users.home.id]: 0 / 5,
	  [users.sekeZ.id]: 1.452 / 5,
	},
	startTime: 26,
	count: 5 - 5,
	purchase: {factor: "157501", date: "06/01/1400", type: "reinvest"},
  }, baseSystem);

  Worker.createWorkerFromProduct({
	source: Hamyar.SOURCE1,
	product: Hamyar.prd_1th_6m_reinvest,
	owners: {
	  [users.hossain.id]: 1.513 / 6,
	  [users.mitra.id]: 0.895 / 6,
	  [users.ali.id]: 0.804 / 6,
	  [users.saeed.id]: 0.619 / 6,
	  [users.zahra.id]: 0.273 / 6,
	  [users.fateme.id]: 0.153 / 6,
	  [users.home.id]: 0.000 / 6,
	  [users.sekeZ.id]: 1.743 / 6,
	},
	startTime: 28,
	count: 6,
	purchase: {factor: "158123", date: "08/01/1400", type: "reinvest"},
  }, baseSystem);

  Worker.createWorkerFromProduct({
	source: Hamyar.SOURCE1,
	product: Hamyar.prd_1th_6m_reinvest,
	owners: {
	  [users.hossain.id]: 1.513 / 6,
	  [users.mitra.id]: 0.895 / 6,
	  [users.ali.id]: 0.804 / 6,
	  [users.saeed.id]: 0.619 / 6,
	  [users.zahra.id]: 0.273 / 6,
	  [users.fateme.id]: 0.153 / 6,
	  [users.home.id]: 0.000 / 6,
	  [users.sekeZ.id]: 1.743 / 6,
	},
	startTime: 28,
	count: 6,
	purchase: {factor: "158124", date: "08/01/1400", type: "reinvest"},
  }, baseSystem);

  Worker.createWorkerFromProduct({
	source: Hamyar.SOURCE1,
	product: Hamyar.prd_1th_6m_reinvest,
	owners: {
	  [users.hossain.id]: 1.513 / 6,
	  [users.mitra.id]: 0.895 / 6,
	  [users.ali.id]: 0.804 / 6,
	  [users.saeed.id]: 0.619 / 6,
	  [users.zahra.id]: 0.273 / 6,
	  [users.fateme.id]: 0.153 / 6,
	  [users.home.id]: 0.000 / 6,
	  [users.sekeZ.id]: 1.743 / 6,
	},
	startTime: 28,
	count: 6 - 6,
	purchase: {factor: "158125", date: "08/01/1400", type: "reinvest"},
  }, baseSystem);

  const liveWallet = Wallet.find({source: Hamyar.SOURCE1, coin: BTC, type: 'live'}, baseSystem)!;
  liveWallet.value = 0;
  liveWallet.lastUpdate = 28;
}

namespace test {
  baseSystem.workers = [];

  const source = Hamyar.SOURCE2;
  const product = Hamyar.prd_1th_6m_reinvest;
  const coin = product.mineCoin;
  const count = 15;

  const user = User.create({
	id: 'vam', title: 'vAm',
	managerShare: NO_SHARE,
	charityShare: NO_SHARE,
	savePolicy: [{start: 30 * 12, rate: 0.30}],
  }, undefined, baseSystem);
  const worker = Worker.createWorkerFromProduct({
	source, product, count,
	owners: user, startTime: 0,
  }, baseSystem);

  const liveWallet = Wallet.find({source, coin, type: 'live'}, baseSystem)!;
  const workingWallet = Wallet.find({source, coin, user, type: 'working'}, baseSystem)!;

  const cost = Coin.exchange(worker.purchase.sumPrice, product.priceCoin, coin, baseSystem);
  workingWallet.value = liveWallet.value = -cost;
}

//region [Test]
// baseSystem.workers = [];

// const vam = User.create({
//   id: 'vam',
//   managerShare: NO_SHARE,
//   charityShare: NO_SHARE,
//   //savePolicy: [{rate: 1, end: 30 * 0.9999}, {rate: 0, end: 30 * 4}, {rate: 0.30, end: 30 * 12}, {rate: 0.5}],
//   savePolicy: [...[1, 2, 3, 4].map(it => ({rate: 1 - (it - 1) / 5, end: 30 * it})), {rate: 0.3}],
//   // savePolicy: [{rate: 1}],
// }, undefined, baseSystem);
// Worker.buyWorkerFromProduct({
//   source: HOSSAINCO_SRC1,
//   product: hossainco_rtx570_8gb_24m,
//   owners: {[vam]: 1},
//   money: 100,
//   moneyCoin: M_IRT,
//   start_day: 30,
// }, baseSystem);

// Worker.newWorkerFromProduct({
//   source: HOSSAINCO_SRC1,
//   product: hossainco_rtx570_8gb_24m,
//   owners: {[vam]: 1},
//   count: 13,
//   start_day: 30,
// }, baseSystem);

// const VAM = 60;
// const vam = User.create({
//   id: 'vam',
//   managerShare: NO_SHARE,
//   charityShare: NO_SHARE,
//   savePolicy: [{rate: 1, end: 30 * 0.9999}, {rate: 0, end: 30 * 4}, {rate: 0.30, end: 30 * 12}, {rate: 0.5}],
// });
//User.create({id: 'vam.hos'}, vam, baseSystem);
// User.create({id: 'vam.sae'}, vam, baseSystem);
// Worker.buyWorkerFromProduct({
//   source: PISHTAZ_SRC1,
//   product: pishtaz_1th_12m_reinvest,
//   owners: {"vam.hos": 0.5, "vam.sae": 0.5},
//   start_day: 30,
//   money: VAM / 2,
//   moneyCoin: M_IRT,
// }, baseSystem);
// Worker.buyWorkerFromProduct({
//   source: Hamyar.SOURCE1,
//   product: hamyar_13th6_6m,
//   owners: {"vam.hos": 0.5, "vam.sae": 0.5},
//   start_day: 30,
//   money: VAM / 2,
//   moneyCoin: M_IRT,
// }, baseSystem);
//
// Worker.buyWorkerFromProduct({
//   source: HASHSHINY_SRC1_BTC,
//   product: hashshiny_btc_10gh,
//   owners: {"vam": 1},
//   start_day: 0,
//   money: 100,
//   moneyCoin: mIRT,
// }, baseSystem);
// Worker.newWorkerFromProduct({
//   source: HASHSHINY_S1,
//   product: hashshiny_btc_10gh,
//   owners: {"vam": 1},
//   count: 500,
//   start_day: 5 - hashshiny_btc_10gh.life,
// }, baseSystem);
//endregion

//region [Init]
baseSystem.currentTime = baseSystem.workers.maxBy(it => it.startTime)?.startTime || 0;
baseSystem.startDate = baseSystem.workers.minBy(it => it.startTime)?.purchase.date || '???';
//endregion


export const showTestPage = async () => await askMenu("test update income", [
  {title: "exit TEST page"},
], async () => {
  const system = JSON.parse(JSON.stringify(baseSystem));

  // @ts-ignore
  const curDay = parseInt(prompt("enter new hamyar_s1 live day:", system.currentTime + 1));
  // @ts-ignore
  const curVal = parseFloat(prompt("enter new hamyar_s1 live value:", 0));
  const liveWallet = Wallet.find({source: Hamyar.SOURCE1, coin: BTC, type: "live"}, system)!;

  console.log("start", {liveWallet});
  console.table([
	...Wallet.findAll({
	  source: Hamyar.SOURCE1,
	  coin: BTC,
	  type: 'working'
	}, system).sort((a, b) => a.value - b.value),
	...Wallet.findAll({
	  source: Hamyar.SOURCE1,
	  coin: BTC,
	  type: 'saving'
	}, system).sort((a, b) => a.value - b.value),
  ]);
  // @ts-ignore
  alert("press");

  Routines.updateIncome(system, liveWallet, curDay, curVal);
  console.log("after update", {liveWallet});
  console.table([
	...Wallet.findAll({
	  source: Hamyar.SOURCE1,
	  coin: BTC,
	  type: 'working'
	}, system).sort((a, b) => a.value - b.value),
	...Wallet.findAll({
	  source: Hamyar.SOURCE1,
	  coin: BTC,
	  type: 'saving'
	}, system).sort((a, b) => a.value - b.value),
  ]);
  // @ts-ignore
  alert("press");

  console.log("after split", {liveWallet});
  console.table([
	...Wallet.findAll({
	  source: Hamyar.SOURCE1,
	  coin: BTC,
	  type: 'working'
	}, system).sort((a, b) => a.value - b.value),
	...Wallet.findAll({
	  source: Hamyar.SOURCE1,
	  coin: BTC,
	  type: 'saving'
	}, system).sort((a, b) => a.value - b.value),
  ]);
  console.log(
	Wallet.findAll({
	  source: Hamyar.SOURCE1,
	  coin: BTC,
	  type: 'working'
	}, system).sumBy(0, it => it.value),
	Wallet.findAll({
	  source: Hamyar.SOURCE1,
	  coin: BTC,
	  type: 'saving'
	}, system).sumBy(0, it => it.value),
  );
  // @ts-ignore
  alert("press");

}, {
  defaultChoice: 0,
});
