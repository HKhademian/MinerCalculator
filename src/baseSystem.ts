//region [Coin]
import {USDT, uBTC, mETH, mIRT, Coin, exchange, newCoin} from "./lib/Coin.ts";
export type {Coin};
export {USDT, uBTC, mETH, mIRT, exchange};
export const coins: Coin[] = [USDT, uBTC, mETH, mIRT];
//endregion

//region [Company, Product, Source]
import {newProduct, Product} from "./lib/Product.ts";

export type {Product};

export const companies = [];
export const sources = [];

const HAMYAR_BASE_6M = newProduct({
  id: "hamyar_base_6m",
  company: "hamyar",
  life: 30 * 6, /*days*/
  price_coin: mIRT,
  mine_coin: uBTC,
  mine_efficiency: 0.51,
});
const HAMYAR_BASE_12M = newProduct({
  id: "hamyar_base_12m",
  life: 30 * 12, /*days*/
}, HAMYAR_BASE_6M);

export const hamyar_1th_6m = newProduct({
  id: "hamyar_1th_6m",
  price: 0.375,
  mine_power: 1.0,
  minCount: Infinity,
  minBuyInterval: Infinity,
}, HAMYAR_BASE_6M);

export const hamyar_1th_6m_reinvest = newProduct({
  id: "hamyar_1th_6m_reinvest",
  price: 0.355,
  mine_power: 1.0,
  minCount: 5,
  minBuyInterval: 7,
}, HAMYAR_BASE_6M);

export const hamyar_5th_6m = newProduct({
  id: "hamyar_5th_6m",
  price: 1.775,
  mine_power: 5.0,
}, HAMYAR_BASE_6M);

export const hamyar_13th6_6m = newProduct({
  id: "hamyar_13th6_6m",
  price: 5.100,
  mine_power: 13.6,
}, HAMYAR_BASE_6M);

export const hamyar_5th_12m = newProduct({
  id: "hamyar_5th_12m",
  company: "hamyar",
  price: 5.000,
  mine_power: 7.7,
}, HAMYAR_BASE_12M);
//
//
// const PISHTAZ_BASE_12M = newProduct({
//   id: "pishtaz_base_12m",
//   company: "pishtaz",
//   life: 30 * 12, /*days*/
//   price_coin: mIRT,
//   mine_coin: uBTC,
//   mine_efficiency: 0.50,
// });
//
// export const pishtaz_4th_12m = newProduct({
//   id: "pishtaz_5th_12m",
//   price: 1.800,
//   mine_power: 4.0,
// }, PISHTAZ_BASE_12M);
//
// export const pishtaz_8th_12m = newProduct({
//   id: "pishtaz_8th_12",
//   price: 4.800,
//   mine_power: 8.0,
// }, PISHTAZ_BASE_12M);
//
// export const pishtaz_8th_3m_fake = newProduct({
//   id: "pishtaz_8th_3fake",
//   life: 30 * 3, /*days*/
//   price: 1.600,
//   mine_power: 8.0,
// }, PISHTAZ_BASE_12M);
//
//
// const IMINER_BASE_5Y = newProduct({
//   id: "iminer_base_5y",
//   company: "iminer",
//   life: 30 * 12 * 5,
//   price_coin: USDT,
//   mine_coin: uBTC,
//   mine_efficiency: 0.50,
// });
//
// export const iminer_1th_5y = newProduct({
//   id: "iminer_1th_5y",
//   price: 20,
//   mine_power: 1.0,
// }, IMINER_BASE_5Y);
//
//
// export const iminer_1usd_5y = newProduct({
//   id: "iminer_1usd_5y",
//   price: 1,
//   mine_power: 0.05,
// }, IMINER_BASE_5Y);
//
//endregion

//region [User]
import {newUser, User} from "./lib/User.ts";

export type {User};

export const BASE_USER: User = newUser({
  id: "base",
  title: "Base User",
  savePolicy: [{
	start: 30 * 18,
	rate: 0.75,
  }, {
	start: 30 * 12,
	rate: 0.60,
  }, {
	start: 30 * 6,
	rate: 0.50,
  }, {
	start: 30 * 3,
	rate: 0.30,
  }],
});

export const users: User[] = [
  newUser({
	id: "manager",
	title: "System Manager",
	savePolicy: {
	  start: 30 * 6,
	  rate: 0.2,
	},
  }, BASE_USER),

  newUser({
	id: "charity",
	title: "System Charity Bank",
	savePolicy: {
	  start: 30 * 3,
	  rate: 0.5,
	},
  }, BASE_USER),

  newUser({
	id: "hossain",
	title: "Hossain",
  }, BASE_USER),

  newUser({
	id: "mitra",
	title: "Mitra",
  }, BASE_USER),

  newUser({
	id: "ali",
	title: "Ali",
  }, BASE_USER),

  newUser({
	id: "saeed",
	title: "Saeed",
  }, BASE_USER),

  newUser({
	id: "zahra",
	title: "Zahra",
  }, BASE_USER),

  newUser({
	id: "fateme",
	title: "Fateme",
  }, BASE_USER),

  newUser({
	id: "home",
	title: "Home",
  }, BASE_USER),

  newUser({
	id: "seke",
	title: "Seke Zahra",
  }, BASE_USER),
];
//endregion

//region [Worker, Wallet]
import {
  buyWorkerFromProduct,
  newWorkerFromProduct,
  Worker,
} from "./lib/Worker.ts";
import type {SavePolicy} from "./lib/User.ts";

export type {Worker};

export const wallets = [];

const purchased_workers: Worker[] = [
  // newWorkerFromProduct({
  // product: pishtaz_4th_12m,
  // owners: {"hossain": 1},
  // start_day: 0,
  // count: 1,
  // purchase: {factorId: "XxXxX", date: "10/12/1399", type: "buy"},
  // }),

  newWorkerFromProduct({
	product: hamyar_5th_6m,
	owners: {"hossain": 1},
	start_day: 0,
	count: 1,
	purchase: {factorId: "151993", date: "10/12/1399", type: "buy"},
  }),

  newWorkerFromProduct({
	product: hamyar_5th_6m,
	owners: {"ali": 1},
	start_day: 0,
	count: 2,
	purchase: {factorId: "152107", date: "10/12/1399", type: "buy"},
  }),

  newWorkerFromProduct({
	product: hamyar_5th_6m,
	owners: {"hossain": 0.75, "mitra": 0.25},
	start_day: 1,
	count: 4,
	purchase: {factorId: "152326", date: "11/12/1399", type: "buy"},
  }),

  newWorkerFromProduct({
	product: hamyar_5th_6m,
	owners: {"seke": 1},
	start_day: 11,
	count: 10,
	purchase: {factorId: "154382", date: "21/12/1399", type: "buy"},
  }),

  newWorkerFromProduct({
	product: hamyar_1th_6m_reinvest,
	owners: {"mitra": 5 / 35, "fateme": 30 / 35},
	start_day: 13,
	count: 5,
	purchase: {factorId: "154849", date: "23/12/1399", type: "reinvest"},
  }),

  newWorkerFromProduct({
	product: hamyar_13th6_6m,
	owners: {"saeed": 1},
	start_day: 16,
	count: 1,
	purchase: {factorId: "155951", date: "26/12/1399", type: "buy"},
  }),

  newWorkerFromProduct({
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
	purchase: {factorId: "156208", date: "27/12/1399", type: "reinvest"},
  }),

  newWorkerFromProduct({
	product: hamyar_13th6_6m,
	owners: {
	  "hossain": 9.600 / 27.2,
	  "mitra": 6.940 / 27.2,
	  "saeed": 2.660 / 27.2,
	  "zahra": 8.00 / 27.2,
	},
	start_day: 17,
	count: 2,
	purchase: {factorId: "156235", date: "27/12/1399", type: "buy"},
  }),

  newWorkerFromProduct({
	product: hamyar_13th6_6m,
	owners: {
	  "hossain": 0.266 / 13.6,
	  "mitra": 13.334 / 13.6,
	},
	start_day: 19,
	count: 1,
	purchase: {factorId: "156450", date: "29/12/1399", type: "buy"},
  }),

  newWorkerFromProduct({
	product: hamyar_13th6_6m,
	owners: {
	  "hossain": 1,
	},
	start_day: 19,
	count: 1,
	purchase: {factorId: "156451", date: "29/12/1399", type: "buy"},
  }),

  newWorkerFromProduct({
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
	purchase: {factorId: "156643", date: "27/12/1399", type: "reinvest"},
  }),

  buyWorkerFromProduct({
	product: hamyar_1th_6m,
	owners: {"vam": 1},
	start_day: 30,
	money: 60,
  }),
];

users.push(newUser({
  id: "vam",
  savePolicy: [
	{
	  rate: 0.50,
	  end: 30 * 6,
	},
	...(BASE_USER.savePolicy as SavePolicy[]),
  ]
}, BASE_USER));

export const products = [hamyar_1th_6m_reinvest];
export const workers = [...purchased_workers];

// import {
//   buyWorkerFromProduct,
//   newWorker,
//   newWorkerFromProduct,
//   Worker,
// } from "../src/Worker.ts";
// import {
//   hamyar_1th_6m,
//   hamyar_5th_6m,
//   hamyar_13th6_6m,
//   hamyar_5th_12m,
//   pishtaz_4th_12m,
//   pishtaz_8th_12m,
//   pishtaz_8th_3m_fake, iminer_1usd_5y, Product, iminer_1th_5y,
// } from "./companies.ts";
// import {exchange, mIRT, uBTC, USDT} from "./coins.ts";
// import {newUser} from "../src/User.ts";
// import {BASE_USER, users} from "./users.ts";
// import {NO_SHARE} from "../src/System.ts";
//
// export type {Worker};
//
// export const products: Product[] = [];
// export const workers: Worker[] = [];
//
//
// products.push(iminer_1usd_5y);
// workers.push(newWorkerFromProduct({
//   product: iminer_1th_5y,
//   owners: {test: 1},
//   count: 1,
// }));
// users.push(newUser({
//   id: 'test',
//   savePolicy: {rate: 0},
//   managerShare: NO_SHARE,
//   charityShare: NO_SHARE,
// }, BASE_USER));
//
// // const powers = Object.entries({
// //   "manager": 0,
// //   "hossain": 44.431,
// //   "mitra": 26.264,
// //   "ali": 10.483,
// //   "saeed": 16.916,
// //   "zahra": 8.0,
// //   "fateme": 4.493,
// //   "home": 0.0,
// //   "seke": 52.413,
// // } as { [_: string]: number });
// // let sum_power = powers.reduce((prev, el) => prev + el[1], 0);
// // let power_owner = Object.fromEntries(powers.map(it => [it[0], it[1] / sum_power]));
// // workers.push(newWorkerFromProduct({
// //   product: hamyar_1th_6m,
// //   owners: power_owner,
// //   start_day: 0,
// //   count: sum_power,
// // }));
// // // powers.forEach(([user, power]) => {
// // //   workers.push(newWorkerFromProduct({
// // // 	product: hamyar_1th_6m,
// // // 	owners: {[user]: 1},
// // // 	start_day: 0,
// // // 	count: power,
// // //   }));
// // // });
// //
// //
// // // users.push(newUser({
// // //   id: "testSeke",
// // //   title: "TestSeke",
// // //   savePolicy: {
// // // 	start: 30 * 1,
// // // 	rate: 0.5,
// // //   },
// // // }, BASE_USER));
// // // workers.push(buyWorkerFromProduct({
// // //   product: hamyar_1th_6m,
// // //   owners: {testSeke: 1},
// // //   start_day: 0,
// // //   money: 15.0,
// // //   money_coin: mIRT,
// // // }));
// //

//endregion

//region [System]
import {System} from "./lib/System.ts";

export type {System};

export const system: System = {
  ...{coins, companies, products, sources, users, workers, wallets},

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
