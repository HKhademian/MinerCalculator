import "./lib/_global.ts";
import {System, NO_SHARE} from "./lib/System.ts";
import {Company} from "./lib/Source.ts";
import {Product} from "./lib/Product.ts";
import {Source} from "./lib/Source.ts";
import {User} from "./lib/User.ts";
import {Worker} from "./lib/Worker.ts";
import {Wallet} from "./lib/Wallet.ts";
import {Coin, USD, BTC, ETH, M_IRT, LTC, ADA, DOGE, DASH} from "./lib/Coin.ts";
import {errVal} from "./util.ts";

export const baseSystem: System = System.create({
  // managerShare: {
  // user: "manager",
  // share: 0.09,
  // },
  // charityShare: {
  // user: "home",
  // share: 0.01,
  // },
});

export namespace HossainCo {
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

export namespace Hamyar {
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
	id: 'hamyar_src1',
	company: COMPANY,
	reinvest: {product: prd_1th_6m_reinvest, minInterval: 2, minCount: 5},
	login: 'h.kh',
  }, undefined, baseSystem);
}

export namespace Pishtaz {
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

export namespace HashShiny {
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

export namespace Hashing24 {
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

export namespace HashFlare {
  export const COMAPNY = Company.create({
	id: 'hashflare',
	title: 'HashFlare',
	link: 'https://hashflare.io/r/76BC7F2C',
  }, undefined, baseSystem);

}

export namespace users {
  export const BASE_USER: User = User.create({
	id: "base",
	title: "Base User",
	savePolicy: [{
	  end: 30 * 3,
	  rate: 0.8,
	}, {
	  end: 30 * 4,
	  rate: 0.5,
	}, {
	  start: 30 * 12,
	  rate: 0.40,
	}, {
	  rate: 0.30,
	}],
  });

  export const manager = User.create({
	id: "manager",
	title: "System Manager",
	// savePolicy: {
	//   start: 30 * 6,
	//   rate: 0.2,
	// },
  }, BASE_USER, baseSystem);

  export const charity = User.create({
	id: "charity",
	title: "System Charity Bank",
	// savePolicy: {
	//   start: 30 * 3,
	//   rate: 0.5,
	// },
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
  const system = baseSystem;
  const source = Pishtaz.SOURCE1;

  Worker.createWorkerFromProduct({
	source,
	product: Pishtaz.prd_4th_12m_old,
	owners: {[users.hossain.id]: 1},
	startTime: 0,
	count: 1,
	purchase: {factor: "XxXxX", date: "10/12/1399", type: "buy"},
  }, system);

  Worker.createWorkerFromProduct({
	source,
	product: Pishtaz.prd_1th_12m_reinvest,
	owners: users.hossain.id,
	startTime: 32,
	count: 1,
	purchase: {factor: "XxX", date: "12/01/1400", type: "reinvest"},
  }, system);
}
namespace workers {
  const system = baseSystem;
  const source = Hamyar.SOURCE1;

  Worker.createWorkerFromProduct({
	source,
	product: Hamyar.prd_5th_6m_v1,
	owners: {[users.hossain.id]: 1},
	startTime: 0,
	count: 1,
	purchase: {factor: "151993", date: "10/12/1399", type: "buy"},
  }, system);

  Worker.createWorkerFromProduct({
	source,
	product: Hamyar.prd_5th_6m_v1,
	owners: {[users.ali.id]: 1},
	startTime: 0,
	count: 2,
	purchase: {factor: "152107", date: "10/12/1399", type: "buy"},
  }, system);

  Worker.createWorkerFromProduct({
	source,
	product: Hamyar.prd_5th_6m_v1,
	owners: {[users.hossain.id]: 0.75, [users.mitra.id]: 0.25},
	startTime: 1,
	count: 4,
	purchase: {factor: "152326", date: "11/12/1399", type: "buy"},
  }, system);

  Worker.createWorkerFromProduct({
	source,
	product: Hamyar.prd_5th_6m_v1,
	owners: {[users.sekeZ.id]: 1},
	startTime: 11,
	count: 10,
	purchase: {factor: "154382", date: "21/12/1399", type: "buy"},
  }, system);

  Worker.createWorkerFromProduct({
	source,
	product: Hamyar.prd_1th_6m_reinvest,
	owners: {[users.mitra.id]: 5 / 35, [users.fateme.id]: 30 / 35},
	startTime: 13,
	count: 5,
	purchase: {factor: "154849", date: "23/12/1399", type: "reinvest"},
  }, system);

  Worker.createWorkerFromProduct({
	source: Hamyar.SOURCE1,
	product: Hamyar.prd_13th6_6m,
	owners: {[users.saeed.id]: 1},
	startTime: 16,
	count: 1,
	purchase: {factor: "155951", date: "26/12/1399", type: "buy"},
  }, system);

  Worker.createWorkerFromProduct({
	source,
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
  }, system);

  Worker.createWorkerFromProduct({
	source,
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
  }, system);

  Worker.createWorkerFromProduct({
	source,
	product: Hamyar.prd_13th6_6m,
	owners: {
	  [users.hossain.id]: 0.266 / 13.6,
	  [users.mitra.id]: 13.334 / 13.6,
	},
	startTime: 19,
	count: 1,
	purchase: {factor: "156450", date: "29/12/1399", type: "buy"},
  }, system);

  Worker.createWorkerFromProduct({
	source,
	product: Hamyar.prd_13th6_6m,
	owners: {
	  [users.hossain.id]: 1,
	},
	startTime: 19,
	count: 1,
	purchase: {factor: "156451", date: "29/12/1399", type: "buy"},
  }, system);

  Worker.createWorkerFromProduct({
	source,
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
  }, system);

  Worker.createWorkerFromProduct({
	source,
	product: Hamyar.prd_13th6_6m,
	owners: {[users.ali.id]: 1},
	startTime: 22,
	count: 1,
	purchase: {factor: "156848", date: "02/01/1400", type: "buy"},
  }, system);

  Worker.createWorkerFromProduct({
	source,
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
  }, system);

  Worker.createWorkerFromProduct({
	source,
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
  }, system);

  Worker.createWorkerFromProduct({
	source,
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
  }, system);

  Worker.createWorkerFromProduct({
	source,
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
  }, system);

  Worker.createWorkerFromProduct({
	source,
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
  }, system);

  Worker.createWorkerFromProduct({
	source,
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
  }, system);

  Worker.createWorkerFromProduct({
	source,
	product: Hamyar.prd_1th_6m_reinvest,
	owners: {
	  [users.hossain.id]: 1.765 / 7,
	  [users.mitra.id]: 1.044 / 7,
	  [users.ali.id]: 0.938 / 7,
	  [users.saeed.id]: 0.722 / 7,
	  [users.zahra.id]: 0.318 / 7,
	  [users.fateme.id]: 0.180 / 7,
	  [users.home.id]: 0.000 / 7,
	  [users.sekeZ.id]: 2.033 / 7,
	},
	startTime: 32,
	count: 7,
	purchase: {factor: "159368", date: "12/01/1400", type: "reinvest"},
  }, system);
}
namespace workers {
  const system = baseSystem;

  const source = Source.create({
	id: 'ham_src_2',
	title: 'HAM_SRC_2',
	reinvest: {product: Hamyar.prd_1th_6m_reinvest, minCount: 5, minInterval: -1},
	login: 'accHossainSec',
  }, Hamyar.SOURCE1, system);

  const baseUser = User.create({
	id: 'hos', title: 'HOS',
	savePolicy: [{start: 30 * 18, rate: 0.5}, {start: 30 * 12, rate: 0.4}, {start: 30 * 6, rate: 0.3}],
  });
  const hos = User.create({id: 'hos', title: 'HOS'}, baseUser, system);
  const mit = User.create({id: 'mit', title: 'MIT'}, baseUser, system);

  // // TODO: test
  // system.workers = [];
  //
  // Worker.reinvestWorkerFromProduct({
  // source,
  // product: Hamyar.prd_1th_6m_reinvest,
  // owners: hos,
  // startTime: 32,
  // count: 89,
  // purchase: {factor: "159366", date: "12/01/1400"},
  // }, system);
  //
  // Worker.reinvestWorkerFromProduct({
  // source,
  // product: Hamyar.prd_1th_6m_reinvest,
  // owners: mit,
  // startTime: 32,
  // count: 10,
  // purchase: {factor: "159464", date: "12/01/1400"},
  // }, system);
}

namespace workers {
  const system = baseSystem;

  system.workers = system.workers.filter(it => it.source == Hamyar.SOURCE1.id);

  const liveWallet = Wallet.find({source: Hamyar.SOURCE1, coin: BTC, type: 'live'}, system)!;
  // in day 29 - account reach 0 from neg value ! so it's a good start point
  // in day 32 - account reach 0 from neg value ! so it's a good start point
  liveWallet.value = 0;
  liveWallet.lastUpdate = 32;
  system.currentTime = 32;

  // init system
  system.startDate = system.startDate || system.workers.minBy((it: Worker) => it.startTime)?.purchase.date || '???';
  system.currentTime = system.currentTime || system.workers.maxBy((it: Worker) => it.startTime)?.startTime || 0;
}

namespace test {
  const system = baseSystem;

  // const shares = Source.getOwnerShares(system, Hamyar.SOURCE1);
  // const powers = Object.entries(shares).map(([u, r]) => [u, toPrec(r, 4), toPrec(r * 100, 4)]);
  //
  // const w = Worker.reinvestWorkerFromProduct({
  // source: Hamyar.SOURCE1,
  // product: Hamyar.prd_1th_6m_reinvest,
  // startTime: system.currentTime,
  // count: 100,
  // }, system);
  //
  // console.log(shares, powers, w);
  // alert();
}
namespace test {
  const system = System.create();// system;

  system.workers = [];
  system.currentTime = 0;

  const usrs = ['hos'/*, 'mit', 'ali', 'sae', 'zah', 'fat'*/];
  const baseCount = 20;
  const reInvestProduct = Hamyar.prd_1th_6m_reinvest;
  //const prds: (Product | string) | (([Product | string, number?] | (Product | string))[]) =
  //[[Hamyar.prd_1th_6m_reinvest, 45], [Hamyar.prd_1th_12m_reinvest, 15]];
  const prds: (Product | string) | (([Product | string, number?] | (Product | string))[]) =
	[[Hamyar.prd_1th_6m_reinvest, 100]];

  let products: [Product, number][] = (
	(Array.isArray(prds) ? prds : [prds])
	  .map(el => Array.isArray(el) ? el : [el])
	  .map(([prd, count]) => [typeof prd != "string" ? prd : Product.findById(prd, system) || errVal("product not found"), count || baseCount])
  ) as any;

  usrs.forEach(id => {
	const source = Source.create({
	  id: 'ham_src3_' + id,
	  reinvest: {product: reInvestProduct},
	}, Hamyar.SOURCE1, system);
	const user = User.create({
	  id: 'usr_' + id, title: 'usr_' + id,
	  managerShare: NO_SHARE, charityShare: NO_SHARE,
	  savePolicy: [
		// {start: 30 + 30 * 30, rate: 0.60},
		{start: 30 + 30 * 24, rate: 0.55},
		{start: 30 + 30 * 18, rate: 0.50},
		{start: 30 + 30 * 12, rate: 0.40},
		{start: 30 + 30 * 7, rate: 0.30},
	  ],
	}, undefined, system);

	products.forEach(([product, count]) => {
	  const coin = product.mineCoin;
	  const worker = Worker.createWorkerFromProduct({
		source, product, count,
		owners: user, startTime: system.currentTime,
	  }, system);
	  const liveWallet = Wallet.find({source, coin, type: 'live'}, system)!;
	  const workingWallet = Wallet.find({source, coin, user, type: 'working'}, system)!;
	  const cost = Coin.exchange(worker.purchase.sumPrice, product.priceCoin, coin, system);
	  liveWallet.value -= cost;
	  workingWallet.value -= cost;
	});
  });
}
namespace test {
  const system = baseSystem;

// system.workers = [];

// const vam = User.create({
//   id: 'vam',
//   managerShare: NO_SHARE,
//   charityShare: NO_SHARE,
//   //savePolicy: [{rate: 1, end: 30 * 0.9999}, {rate: 0, end: 30 * 4}, {rate: 0.30, end: 30 * 12}, {rate: 0.5}],
//   savePolicy: [...[1, 2, 3, 4].map(it => ({rate: 1 - (it - 1) / 5, end: 30 * it})), {rate: 0.3}],
//   // savePolicy: [{rate: 1}],
// }, undefined, system);
// Worker.buyWorkerFromProduct({
//   source: HOSSAINCO_SRC1,
//   product: hossainco_rtx570_8gb_24m,
//   owners: {[vam]: 1},
//   money: 100,
//   moneyCoin: M_IRT,
//   start_day: 30,
// }, system);

// Worker.newWorkerFromProduct({
//   source: HOSSAINCO_SRC1,
//   product: hossainco_rtx570_8gb_24m,
//   owners: {[vam]: 1},
//   count: 13,
//   start_day: 30,
// }, system);

// const VAM = 60;
// const vam = User.create({
//   id: 'vam',
//   managerShare: NO_SHARE,
//   charityShare: NO_SHARE,
//   savePolicy: [{rate: 1, end: 30 * 0.9999}, {rate: 0, end: 30 * 4}, {rate: 0.30, end: 30 * 12}, {rate: 0.5}],
// });
//User.create({id: 'vam.hos'}, vam, system);
// User.create({id: 'vam.sae'}, vam, system);
// Worker.buyWorkerFromProduct({
//   source: PISHTAZ_SRC1,
//   product: pishtaz_1th_12m_reinvest,
//   owners: {"vam.hos": 0.5, "vam.sae": 0.5},
//   start_day: 30,
//   money: VAM / 2,
//   moneyCoin: M_IRT,
// }, system);
// Worker.buyWorkerFromProduct({
//   source: Hamyar.SOURCE1,
//   product: hamyar_13th6_6m,
//   owners: {"vam.hos": 0.5, "vam.sae": 0.5},
//   start_day: 30,
//   money: VAM / 2,
//   moneyCoin: M_IRT,
// }, system);
//
// Worker.buyWorkerFromProduct({
//   source: HASHSHINY_SRC1_BTC,
//   product: hashshiny_btc_10gh,
//   owners: {"vam": 1},
//   start_day: 0,
//   money: 100,
//   moneyCoin: mIRT,
// }, system);
// Worker.newWorkerFromProduct({
//   source: HASHSHINY_S1,
//   product: hashshiny_btc_10gh,
//   owners: {"vam": 1},
//   count: 500,
//   start_day: 5 - hashshiny_btc_10gh.life,
// }, system);
}
