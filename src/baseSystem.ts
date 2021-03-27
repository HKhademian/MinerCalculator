//region [System]
import {NO_SHARE, System} from "./lib/System.ts";

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
//endregion
//region [Coin]
import {Coin, exchange} from "./lib/Coin.ts";
import {USD, BTC, ETH, M_IRT, LTC, ADA, DOGE, DASH} from "./lib/Coin.ts";
//endregion

//region [Company]
import {Company} from "./lib/Source.ts";

const HAMYAR = Company.create({
  id: 'hamyar',
  title: 'Hamyar Miner',
}, undefined, baseSystem);
const PISHTAZ = Company.create({
  id: 'pishtaz',
  title: 'Pishtaz Miner',
}, undefined, baseSystem);
const HASHSHINY = Company.create({
  id: 'hashshiny',
  title: 'Hash Shiny',
}, undefined, baseSystem);
const HOSSAINCO = Company.create({
  id: 'hossainco',
  title: 'HossainCo',
}, undefined, baseSystem);
//endregion
//region [Product]
import {Product} from "./lib/Product.ts";

const PISHTAZ_BASE_12M = Product.create({
  id: "pishtaz_base_12m",
  company: PISHTAZ,
  life: 30 * 12,
  priceCoin: M_IRT,
  mineCoin: BTC,
  mineEfficiency: 0.51,
});
const pishtaz_1th_12m_reinvest = Product.create({
  id: "pishtaz_1th_12m_reinvest",
  price: 0.600,
  minePower: 1.0,
}, PISHTAZ_BASE_12M, baseSystem);

const HAMYAR_BASE_6M = Product.create({
  id: "hamyar_base_6m",
  company: HAMYAR,
  life: 30 * 6,
  priceCoin: M_IRT,
  mineCoin: BTC,
  mineEfficiency: 0.51,
});
const HAMYAR_BASE_12M = Product.create({
  id: "hamyar_base_12m",
  life: 30 * 12,
}, HAMYAR_BASE_6M);
const hamyar_1th_6m_reinvest = Product.create({
  id: "hamyar_1th_6m_reinvest",
  price: 0.355,
  minePower: 1.0,
}, HAMYAR_BASE_6M, baseSystem);
const hamyar_13th6_6m = Product.create({
  id: "hamyar_13th6_6m",
  price: 5.100,
  minePower: 13.6,
}, HAMYAR_BASE_6M, baseSystem);

const HASHSHINY_BASE = Product.create({
  id: "hashshiny_base",
  company: HASHSHINY,
  life: 30 * 24,
  priceCoin: USD,
  mineCoin: BTC,
  minePower: 0.0,
  mineEfficiency: 0.0,
});
const hashshiny_btc_10gh = Product.create({
  id: "hashshiny_btc_10gh",
  price: 1.05,
  priceCoin: USD,
  mineCoin: BTC,
  minePower: 0.010,
  mineEfficiency: 0.75,
}, HASHSHINY_BASE, baseSystem);
const hashshiny_dash_100mh = Product.create({
  id: "hashshiny_btc_100mh",
  price: 0.89,
  priceCoin: USD,
  mineCoin: DASH,
  minePower: 0.1,
  mineEfficiency: 0.9,
}, HASHSHINY_BASE, baseSystem);

const HOSSAINCO_BASE = Product.create({
  id: "hossainco_base",
  company: HOSSAINCO,
  life: 30 * 24,
  priceCoin: USD,
  mineCoin: ETH,
  minePower: 0.0,
  mineEfficiency: 0.90,
});
const hossainco_30mh_24m = Product.create({
  id: "hossainco_30mh_24m",
  price: 17,
  priceCoin: M_IRT,
  mineCoin: ETH,
  minePower: 30,
  mineEfficiency: 0.75,
}, HOSSAINCO_BASE, baseSystem);
const hossainco_32mh_24m = Product.create({
  id: "hossainco_32mh_24m",
  price: 11,
  priceCoin: M_IRT,
  mineCoin: ETH,
  minePower: 32,
  mineEfficiency: 0.50,
}, HOSSAINCO_BASE, baseSystem);
const hossainco_rtx570_8gb_24m = Product.create({
  id: "hossainco_rtx570_8gb_24m",
  life: 30 * 12,
  price: 310,
  priceCoin: USD,
  mineCoin: ETH,
  minePower: 30,
  mineEfficiency: 0.90,
  desc: 'https://www.kryptex.org/en/hardware/amd-rx-570-8gb',
}, HOSSAINCO_BASE, baseSystem);
const hossainco_rtx580_8gb_24m = Product.create({
  id: "hossainco_rtx580_8gb_24m",
  life: 30 * 12,
  price: 340,
  priceCoin: USD,
  mineCoin: ETH,
  minePower: 32,
  mineEfficiency: 0.90,
  desc: 'https://www.kryptex.org/en/hardware/amd-rx-580-8gb',
}, HOSSAINCO_BASE, baseSystem);
//endregion
//region [Source]
import {Source} from "./lib/Source.ts";

const HAMYAR_SRC1 = Source.create({
  id: 'hamyar_s1',
  company: HAMYAR,
  reinvest: {product: hamyar_1th_6m_reinvest, minInterval: 3, minCount: 5},
  login: 'h.kh',
}, undefined, baseSystem);
const PISHTAZ_SRC1 = Source.create({
  id: 'pishtaz_s1',
  company: PISHTAZ,
  login: 'h.kh',
  reinvest: {product: pishtaz_1th_12m_reinvest, minInterval: 3, minCount: 5},
}, undefined, baseSystem);
const HASHSHINY_SRC1_BTC = Source.create({
  id: 'hashshiny_s1',
  company: HASHSHINY,
  reinvest: {product: hashshiny_btc_10gh, minCount: 1, minInterval: 1},
  login: 'h.kh',
}, undefined, baseSystem);
const HASHSHINY_SRC1_DASH = Source.create({
  id: 'hashshiny_s2',
  company: HASHSHINY,
  reinvest: {product: hashshiny_dash_100mh, minCount: 1, minInterval: 1},
  login: 'h.kh',
}, undefined, baseSystem);
const HOSSAINCO_SRC1 = Source.create({
  id: 'hossainco_src2',
  company: HOSSAINCO,
  reinvest: {product: hossainco_rtx570_8gb_24m, minCount: 1, minInterval: 1},
  login: 'h.kh',
}, undefined, baseSystem);
//endregion

//region [User]
import {User} from "./lib/User.ts";
import type {SavePolicy} from "./lib/User.ts";

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

User.create({
  id: "manager",
  title: "System Manager",
  savePolicy: {
	start: 30 * 6,
	rate: 0.2,
  },
}, BASE_USER, baseSystem);
User.create({
  id: "charity",
  title: "System Charity Bank",
  savePolicy: {
	start: 30 * 3,
	rate: 0.5,
  },
}, BASE_USER, baseSystem);

User.create({
  id: "hossain",
  title: "Hossain",
}, BASE_USER, baseSystem);

User.create({
  id: "mitra",
  title: "Mitra",
}, BASE_USER, baseSystem);

User.create({
  id: "ali",
  title: "Ali",
}, BASE_USER, baseSystem);

User.create({
  id: "saeed",
  title: "Saeed",
}, BASE_USER, baseSystem);

User.create({
  id: "zahra",
  title: "Zahra",
}, BASE_USER, baseSystem);

User.create({
  id: "fateme",
  title: "Fateme",
}, BASE_USER, baseSystem);

User.create({
  id: "home",
  title: "Home",
}, BASE_USER, baseSystem);

User.create({
  id: "seke",
  title: "Seke Zahra",
}, BASE_USER, baseSystem);
//endregion
//region [Worker, Wallet]
import {Worker} from "./lib/Worker.ts";

const pishtaz_4th_12m_old = Product.create({
  id: "pishtaz_4th_12m",
  price: 1.8,
  minePower: 4.0,
}, PISHTAZ_BASE_12M);
Worker.newWorkerFromProduct({
  source: PISHTAZ_SRC1,
  product: pishtaz_4th_12m_old,
  owners: {"hossain": 1},
  startTime: 0,
  count: 1,
  purchase: {factor: "XxXxX", date: "10/12/1399", type: "buy"},
}, baseSystem);

const hamyar_5th_6m_v1 = Product.create({
  price: 1.5,
  minePower: 5.0,
}, HAMYAR_BASE_6M);

Worker.newWorkerFromProduct({
  source: HAMYAR_SRC1,
  product: hamyar_5th_6m_v1,
  owners: {"hossain": 1},
  startTime: 0,
  count: 1,
  purchase: {factor: "151993", date: "10/12/1399", type: "buy"},
}, baseSystem);

Worker.newWorkerFromProduct({
  source: HAMYAR_SRC1,
  product: hamyar_5th_6m_v1,
  owners: {"ali": 1},
  startTime: 0,
  count: 2,
  purchase: {factor: "152107", date: "10/12/1399", type: "buy"},
}, baseSystem);

Worker.newWorkerFromProduct({
  source: HAMYAR_SRC1,
  product: hamyar_5th_6m_v1,
  owners: {"hossain": 0.75, "mitra": 0.25},
  startTime: 1,
  count: 4,
  purchase: {factor: "152326", date: "11/12/1399", type: "buy"},
}, baseSystem);

Worker.newWorkerFromProduct({
  source: HAMYAR_SRC1,
  product: hamyar_5th_6m_v1,
  owners: {"seke": 1},
  startTime: 11,
  count: 10,
  purchase: {factor: "154382", date: "21/12/1399", type: "buy"},
}, baseSystem);

Worker.newWorkerFromProduct({
  source: HAMYAR_SRC1,
  product: hamyar_1th_6m_reinvest,
  owners: {"mitra": 5 / 35, "fateme": 30 / 35},
  startTime: 13,
  count: 5,
  purchase: {factor: "154849", date: "23/12/1399", type: "reinvest"},
}, baseSystem);

Worker.newWorkerFromProduct({
  source: HAMYAR_SRC1,
  product: hamyar_13th6_6m,
  owners: {"saeed": 1},
  startTime: 16,
  count: 1,
  purchase: {factor: "155951", date: "26/12/1399", type: "buy"},
}, baseSystem);

Worker.newWorkerFromProduct({
  source: HAMYAR_SRC1,
  product: hamyar_1th_6m_reinvest,
  owners: {
	"hossain": 0.965 / 5,
	"mitra": 0.276 / 5,
	"ali": 0.483 / 5,
	"saeed": 0.656 / 5,
	"fateme": 0.207 / 5,
	"seke": 2.413 / 5,
  },
  startTime: 17,
  count: 5,
  purchase: {factor: "156208", date: "27/12/1399", type: "reinvest"},
}, baseSystem);

Worker.newWorkerFromProduct({
  source: HAMYAR_SRC1,
  product: hamyar_13th6_6m,
  owners: {
	"hossain": 9.600 / 27.2,
	"mitra": 6.940 / 27.2,
	"saeed": 2.660 / 27.2,
	"zahra": 8.00 / 27.2,
  },
  startTime: 17,
  count: 2,
  purchase: {factor: "156235", date: "27/12/1399", type: "buy"},
}, baseSystem);

Worker.newWorkerFromProduct({
  source: HAMYAR_SRC1,
  product: hamyar_13th6_6m,
  owners: {
	"hossain": 0.266 / 13.6,
	"mitra": 13.334 / 13.6,
  },
  startTime: 19,
  count: 1,
  purchase: {factor: "156450", date: "29/12/1399", type: "buy"},
}, baseSystem);

Worker.newWorkerFromProduct({
  source: HAMYAR_SRC1,
  product: hamyar_13th6_6m,
  owners: {
	"hossain": 1,
  },
  startTime: 19,
  count: 1,
  purchase: {factor: "156451", date: "29/12/1399", type: "buy"},
}, baseSystem);

Worker.newWorkerFromProduct({
  source: HAMYAR_SRC1,
  product: hamyar_1th_6m_reinvest,
  owners: {
	"hossain": 1.635 / 6,
	"mitra": 0.967 / 6,
	"ali": 0.386 / 6,
	"saeed": 1.929 / 6,
	"zahra": 0.294 / 6,
	"fateme": 0.166 / 6,
	"home": 0 / 6,
	"seke": 0.623 / 6,
  },
  startTime: 20,
  count: 6,
  purchase: {factor: "156643", date: "27/12/1399", type: "reinvest"},
}, baseSystem);

Worker.newWorkerFromProduct({
  source: HAMYAR_SRC1,
  product: hamyar_13th6_6m,
  owners: {"ali": 1},
  startTime: 22,
  count: 1,
  purchase: {factor: "156848", date: "02/01/1400", type: "buy"},
}, baseSystem);

Worker.newWorkerFromProduct({
  source: HAMYAR_SRC1,
  product: hamyar_1th_6m_reinvest,
  owners: {
	"hossain": 1.766 / 7,
	"mitra": 1.044 / 7,
	"ali": 0.938 / 7,
	"saeed": 0.722 / 7,
	"zahra": 0.318 / 7,
	"fateme": 0.179 / 7,
	"home": 0 / 7,
	"seke": 2.033 / 7,
  },
  startTime: 24,
  count: 7,
  purchase: {factor: "157259", date: "04/01/1400", type: "reinvest"},
}, baseSystem);

Worker.newWorkerFromProduct({
  source: HAMYAR_SRC1,
  product: hamyar_1th_6m_reinvest,
  owners: {
	"hossain": 1.261 / 5,
	"mitra": 0.746 / 5,
	"ali": 0.670 / 5,
	"saeed": 0.516 / 5,
	"zahra": 0.227 / 5,
	"fateme": 0.128 / 5,
	"home": 0 / 5,
	"seke": 1.452 / 5,
  },
  startTime: 26,
  count: 4,
  purchase: {factor: "157500", date: "06/01/1400", type: "reinvest"},
}, baseSystem);
//endregion

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
//   source: HAMYAR_SRC1,
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
baseSystem.currentTime = baseSystem.workers.reduce((prev, el) => Math.max(prev, el.startTime), 0) || 0;
baseSystem.startDate = baseSystem.workers.length <= 0 ? '?' : baseSystem.workers.reduce(
  (prev, el) => prev.startTime <= el.startTime ? prev : el,
  baseSystem.workers[0]).purchase.date;
//endregion
