//region [System]
import {NO_SHARE, System} from "./lib/System.ts";

export const baseSystem: System = {
  ...{companies: [], products: [], sources: [], users: [], workers: [], wallets: []},
  coins: [USDT, mIRT, uBTC, mETH, mDASH],

  startDate: "",
  timeShift: 0,
  currentTime: 0,

  managerShare: {
	userId: "manager",
	share: 0.05,
  },

  charity: {
	userId: "charity",
	share: 0,
  },
} as System;
//endregion

//region [Coin]
import {USDT, uBTC, mETH, mIRT, Coin, exchange, mDASH} from "./lib/Coin.ts";
//endregion

//region [Company, Product, Source]
import {Source} from "./lib/Source.ts";
import {Company} from "./lib/Source.ts";
import {Product} from "./lib/Product.ts";

const HAMYAR = Company.newCompany({
  id: 'hamyar',
  title: 'Hamyar Miner',
}, undefined, baseSystem);
const PISHTAZ = Company.newCompany({
  id: 'pishtaz',
  title: 'Pishtaz Miner',
}, undefined, baseSystem);
const HASHSHINY = Company.newCompany({
  id: 'hashshiny',
  title: 'Hash Shiny',
}, undefined, baseSystem);

const HAMYAR_BASE_6M = Product.newProduct({
  id: "hamyar_base_6m",
  companyId: HAMYAR.id,
  life: 30 * 6,
  priceCoinId: mIRT.id,
  mineCoinId: uBTC.id,
  mineEfficiency: 0.51,
}, undefined, baseSystem);
const HAMYAR_BASE_12M = Product.newProduct({
  id: "hamyar_base_12m",
  life: 30 * 12,
}, HAMYAR_BASE_6M, baseSystem);
const hamyar_1th_6m_reinvest = Product.newProduct({
  id: "hamyar_1th_6m_reinvest",
  price: 0.355,
  minePower: 1.0,
  limits: {
	minCount: 5,
	minBuyInterval: 3,
  },
}, HAMYAR_BASE_6M, baseSystem);
const hamyar_13th6_6m = Product.newProduct({
  id: "hamyar_13th6_6m",
  price: 5.100,
  minePower: 13.6,
}, HAMYAR_BASE_6M, baseSystem);

const HASHSHINY_BASE = Product.newProduct({
  id: "hashshiny_base",
  companyId: HASHSHINY.id,
  life: 30 * 24,
  priceCoinId: USDT.id,
  mineCoinId: uBTC.id,
  minePower: 0.0,
  mineEfficiency: 0.0,
}, undefined, baseSystem);
const hashshiny_btc_10gh = Product.newProduct({
  id: "hashshiny_btc_10gh",
  price: 1.05,
  priceCoinId: USDT.id,
  mineCoinId: uBTC.id,
  minePower: 0.010,
  mineEfficiency: 0.75,
}, HASHSHINY_BASE, baseSystem);
const hashshiny_dash_100mh = Product.newProduct({
  id: "hashshiny_btc_100mh",
  price: 0.89,
  priceCoinId: USDT.id,
  mineCoinId: mDASH.id,
  minePower: 0.1,
  mineEfficiency: 0.9,
  limits: {minBuyInterval: 7},
}, HASHSHINY_BASE, baseSystem);

const HAMYAR_S1 = Source.newSource({
  id: 'hamyar_s1',
  company: HAMYAR.id,
  reinvestProduct: hamyar_1th_6m_reinvest.id,
  login: 'h.kh',
}, undefined, baseSystem);
const PISHTAZ_S1 = Source.newSource({
  id: 'pishtaz_s1',
  company: PISHTAZ.id,
  login: 'h.kh',
}, undefined, baseSystem);
const HASHSHINY_S1_BTC = Source.newSource({
  id: 'hashshiny_s1',
  company: HASHSHINY.id,
  reinvestProduct: hashshiny_btc_10gh.id,
  login: 'h.kh',
}, undefined, baseSystem);
const HASHSHINY_S1_DASH = Source.newSource({
  id: 'hashshiny_s1',
  company: HASHSHINY.id,
  reinvestProduct: hashshiny_dash_100mh.id,
  login: 'h.kh',
}, undefined, baseSystem);
//endregion

//region [User]
import {User} from "./lib/User.ts";
import type {SavePolicy} from "./lib/User.ts";

const BASE_USER: User = User.newUser({
  id: "base",
  title: "Base User",
  savePolicy: [{
	start: 30 * 6,
	rate: 0.40,
  }, {
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

User.newUser({
  id: "manager",
  title: "System Manager",
  // savePolicy: {
  //   start: 30 * 6,
  //   rate: 0.2,
  // },
}, BASE_USER, baseSystem);
User.newUser({
  id: "charity",
  title: "System Charity Bank",
  savePolicy: {
	start: 30 * 3,
	rate: 0.5,
  },
}, BASE_USER, baseSystem);

User.newUser({
  id: "hossain",
  title: "Hossain",
}, BASE_USER, baseSystem);

User.newUser({
  id: "mitra",
  title: "Mitra",
}, BASE_USER, baseSystem);

User.newUser({
  id: "ali",
  title: "Ali",
}, BASE_USER, baseSystem);

User.newUser({
  id: "saeed",
  title: "Saeed",
}, BASE_USER, baseSystem);

User.newUser({
  id: "zahra",
  title: "Zahra",
}, BASE_USER, baseSystem);

User.newUser({
  id: "fateme",
  title: "Fateme",
}, BASE_USER, baseSystem);

User.newUser({
  id: "home",
  title: "Home",
}, BASE_USER, baseSystem);

User.newUser({
  id: "seke",
  title: "Seke Zahra",
}, BASE_USER, baseSystem);
//endregion

//region [Worker, Wallet]
import {Worker} from "./lib/Worker.ts";

// newWorkerFromProduct({
// product: pishtaz_4th_12m,
// owners: {"hossain": 1},
// start_day: 0,
// count: 1,
// purchase: {factorId: "XxXxX", date: "10/12/1399", type: "buy"},
// });

const hamyar_5th_6m_v1 = Product.newProduct({
  price: 1.5,
  minePower: 5.0,
}, HAMYAR_BASE_6M);

Worker.newWorkerFromProduct({
  source: HAMYAR_S1,
  product: hamyar_5th_6m_v1,
  owners: {"hossain": 1},
  start_day: 0,
  count: 1,
  purchase: {factor: "151993", date: "10/12/1399", type: "buy"},
}, baseSystem);

Worker.newWorkerFromProduct({
  source: HAMYAR_S1,
  product: hamyar_5th_6m_v1,
  owners: {"ali": 1},
  start_day: 0,
  count: 2,
  purchase: {factor: "152107", date: "10/12/1399", type: "buy"},
}, baseSystem);

Worker.newWorkerFromProduct({
  source: HAMYAR_S1,
  product: hamyar_5th_6m_v1,
  owners: {"hossain": 0.75, "mitra": 0.25},
  start_day: 1,
  count: 4,
  purchase: {factor: "152326", date: "11/12/1399", type: "buy"},
}, baseSystem);

Worker.newWorkerFromProduct({
  source: HAMYAR_S1,
  product: hamyar_5th_6m_v1,
  owners: {"seke": 1},
  start_day: 11,
  count: 10,
  purchase: {factor: "154382", date: "21/12/1399", type: "buy"},
}, baseSystem);

Worker.newWorkerFromProduct({
  source: HAMYAR_S1,
  product: hamyar_1th_6m_reinvest,
  owners: {"mitra": 5 / 35, "fateme": 30 / 35},
  start_day: 13,
  count: 5,
  purchase: {factor: "154849", date: "23/12/1399", type: "reinvest"},
}, baseSystem);

Worker.newWorkerFromProduct({
  source: HAMYAR_S1,
  product: hamyar_13th6_6m,
  owners: {"saeed": 1},
  start_day: 16,
  count: 1,
  purchase: {factor: "155951", date: "26/12/1399", type: "buy"},
}, baseSystem);

Worker.newWorkerFromProduct({
  source: HAMYAR_S1,
  product: hamyar_1th_6m_reinvest,
  owners: {
	"hossain": 0.965 / 5,
	"mitra": 0.276 / 5,
	"ali": 0.483 / 5,
	"saeed": 0.656 / 5,
	"fateme": 0.207 / 5,
	"seke": 2.413 / 5,
  },
  start_day: 17,
  count: 5,
  purchase: {factor: "156208", date: "27/12/1399", type: "reinvest"},
}, baseSystem);

Worker.newWorkerFromProduct({
  source: HAMYAR_S1,
  product: hamyar_13th6_6m,
  owners: {
	"hossain": 9.600 / 27.2,
	"mitra": 6.940 / 27.2,
	"saeed": 2.660 / 27.2,
	"zahra": 8.00 / 27.2,
  },
  start_day: 17,
  count: 2,
  purchase: {factor: "156235", date: "27/12/1399", type: "buy"},
}, baseSystem);

Worker.newWorkerFromProduct({
  source: HAMYAR_S1,
  product: hamyar_13th6_6m,
  owners: {
	"hossain": 0.266 / 13.6,
	"mitra": 13.334 / 13.6,
  },
  start_day: 19,
  count: 1,
  purchase: {factor: "156450", date: "29/12/1399", type: "buy"},
}, baseSystem);

Worker.newWorkerFromProduct({
  source: HAMYAR_S1,
  product: hamyar_13th6_6m,
  owners: {
	"hossain": 1,
  },
  start_day: 19,
  count: 1,
  purchase: {factor: "156451", date: "29/12/1399", type: "buy"},
}, baseSystem);

Worker.newWorkerFromProduct({
  source: HAMYAR_S1,
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
  start_day: 20,
  count: 6,
  purchase: {factor: "156643", date: "27/12/1399", type: "reinvest"},
}, baseSystem);

Worker.newWorkerFromProduct({
  source: HAMYAR_S1,
  product: hamyar_13th6_6m,
  owners: {"ali": 1},
  start_day: 22,
  count: 1,
  purchase: {factor: "156848", date: "02/01/1400", type: "buy"},
}, baseSystem);

Worker.newWorkerFromProduct({
  source: HAMYAR_S1,
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
  start_day: 24,
  count: 7,
  purchase: {factor: "157259", date: "04/01/1400", type: "reinvest"},
}, baseSystem);
//endregion

// User.newUser({
//   id: 'vam',
//   managerShare: NO_SHARE,
//   charityShare: NO_SHARE,
//   savePolicy: [{rate: 1, end: 3 * 30}, {rate: 0.4, end: -12 * 30}, {rate: 1}],
// }, undefined, baseSystem);
// Worker.buyWorkerFromProduct({
//   source: HAMYAR_S1,
//   product: hamyar_13th6_6m,
//   owners: {"vam": 1},
//   start_day: 0,
//   money: 100,
//   moneyCoin: mIRT,
// }, baseSystem);
// Worker.buyWorkerFromProduct({
//   source: HASHSHINY_S1_BTC,
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
