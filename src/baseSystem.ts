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

export const baseSystem: System = await System.create({
  // managerShare: {
  // user: "manager",
  // share: 0.09,
  // },
  // charityShare: {
  // user: "home",
  // share: 0.01,
  // },
}, undefined, async (system) => {
  await System.set(system);

  const HOSSAINCO = await Company.create({
	id: 'hossainco',
	title: 'HossainCo',
  }, undefined, system);
  const HCO_PRD_BASE = await Product.create({
	id: "hossainco_base",
	company: HOSSAINCO,
	life: 30 * 24,
	priceCoin: USD,
	mineCoin: ETH,
	minePower: 0.0,
	mineEfficiency: 0.90,
  });
  const HCO_PRD_30mh_24m = await Product.create({
	id: "hossainco_30mh_24m",
	price: 17,
	priceCoin: M_IRT,
	mineCoin: ETH,
	minePower: 30,
	mineEfficiency: 0.75,
  }, HCO_PRD_BASE, system);
  const HCO_PRD_32mh_24m = await Product.create({
	id: "hossainco_32mh_24m",
	price: 11,
	priceCoin: M_IRT,
	mineCoin: ETH,
	minePower: 32,
	mineEfficiency: 0.50,
  }, HCO_PRD_BASE, system);
  const HCO_PRD_rtx570_8gb_24m = await Product.create({
	id: "hossainco_rtx570_8gb_24m",
	life: 30 * 12,
	price: 310,
	priceCoin: USD,
	mineCoin: ETH,
	minePower: 30,
	mineEfficiency: 0.90,
	desc: 'https://www.kryptex.org/en/hardware/amd-rx-570-8gb',
  }, HCO_PRD_BASE, system);
  const HCO_PRD_rtx580_8gb_24m = await Product.create({
	id: "hossainco_rtx580_8gb_24m",
	life: 30 * 12,
	price: 340,
	priceCoin: USD,
	mineCoin: ETH,
	minePower: 32,
	mineEfficiency: 0.90,
	desc: 'https://www.kryptex.org/en/hardware/amd-rx-580-8gb',
  }, HCO_PRD_BASE, system);
  const HCO_SRC1 = await Source.create({
	id: 'hossainco_src2',
	company: HOSSAINCO,
	reinvest: {product: HCO_PRD_rtx580_8gb_24m, minCount: 1, minInterval: 1},
	login: 'h.kh',
  }, undefined, system);

  const HAMYAR = await Company.create({
	id: 'hamyar',
	title: 'Hamyar Miner',
  }, undefined, system);
  const HAMYAR_PRD_BASE_6M = await Product.create({
	id: "hamyar_base_6m",
	company: HAMYAR,
	life: 30 * 6,
	priceCoin: M_IRT,
	mineCoin: BTC,
	mineEfficiency: 0.51,
  });
  const HAMYAR_PRD_1th_6m = await Product.create({
	id: "hamyar_1th_6m",
	price: 0.355,
	minePower: 1.0,
  }, HAMYAR_PRD_BASE_6M, system);

  const PISHTAZ = await Company.create({
	id: 'pishtaz',
	title: 'Pishtaz Miner',
  }, undefined, system);
  const PIS_PRD_BASE = await Product.create({
	id: "pishtaz_base_12m",
	company: PISHTAZ,
	life: 30 * 12,
	priceCoin: M_IRT,
	mineCoin: BTC,
	mineEfficiency: 0.51,
  });
  const PIS_PRD_1th_12m_reinvest = await Product.create({
	id: "pishtaz_1th_12m_reinvest",
	price: 0.550,
	minePower: 1.0,
  }, PIS_PRD_BASE, system);
  const PIS_PRD_4th_12m_old = await Product.create({
	id: "pishtaz_4th_12m",
	price: 1.8,
	minePower: 4.0,
  }, PIS_PRD_BASE);

  const HASHSHINY = await Company.create({
	id: 'hashshiny',
	title: 'Hash Shiny',
  }, undefined, system);
  const SHINY_PRD_BASE = await Product.create({
	id: "hashshiny_base",
	company: HASHSHINY,
	life: 30 * 24,
	priceCoin: USD,
	mineCoin: BTC,
	minePower: 0.0,
	mineEfficiency: 0.0,
  });
  const SHINY_PRD_btc_10gh = await Product.create({
	id: "hashshiny_btc_10gh",
	price: 1.05,
	priceCoin: USD,
	mineCoin: BTC,
	minePower: 0.010,
	mineEfficiency: 0.75,
  }, SHINY_PRD_BASE, system);
  const SHINY_PRD_dash_100mh = await Product.create({
	id: "hashshiny_btc_100mh",
	price: 0.89,
	priceCoin: USD,
	mineCoin: DASH,
	minePower: 0.1,
	mineEfficiency: 0.9,
  }, SHINY_PRD_BASE, system);
  const SHINY_SRC1_BTC = await Source.create({
	id: 'hashshiny_s1',
	company: HASHSHINY,
	reinvest: {product: SHINY_PRD_btc_10gh, minCount: 1, minInterval: 1},
	login: 'h.kh',
  }, undefined, system);
  const SHINY_SRC1_ETH = await Source.create({
	id: 'hashshiny_s2',
	company: HASHSHINY,
	reinvest: {product: SHINY_PRD_dash_100mh, minCount: 1, minInterval: 1},
	login: 'h.kh',
  }, undefined, system);

  const HASHING24 = await Company.create({
	id: 'hashing24',
	title: 'Hash Shiny',
	link: 'https://hashing24.com/?rid=53616c7465645f5fe55576b18571d7f48310fdf2bb515d30',
  }, undefined, system);
  const HASHING24_PRD_BASE_12M = await Product.create({
	id: "hashing_base_12m",
	company: HASHING24,
	life: 30 * 12,
	priceCoin: USD,
	mineCoin: BTC,
	mineEfficiency: 1,
  });
  const HASHING24_PRD_host_12m = await Product.create({
	price: 10.1,
	minePower: 0.1 * 1.05,
  }, HASHING24_PRD_BASE_12M, system);
  const HASHING24_SRC1 = await Source.create({
	id: 'hashing_src1',
	company: HASHING24,
	reinvest: {product: HASHING24_PRD_host_12m, minInterval: 7, minCount: 10},
	login: 'h.kh',
  }, undefined, system);

  const HASH_FLARE = await Company.create({
	id: 'hashflare',
	title: 'HashFlare',
	link: 'https://hashflare.io/r/76BC7F2C',
  }, undefined, system);

  const USR_BASE: User = await User.create({
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
  const USR_manager = await User.create({
	id: "manager",
	title: "System Manager",
	// savePolicy: {
	//   start: 30 * 6,
	//   rate: 0.2,
	// },
  }, USR_BASE, system);
  const USR_charity = await User.create({
	id: "charity",
	title: "System Charity Bank",
	// savePolicy: {
	//   start: 30 * 3,
	//   rate: 0.5,
	// },
  }, USR_BASE, system);
  const USR_hossain = await User.create({
	id: "hossain",
	title: "Hossain",
  }, USR_BASE, system);
  const USR_mitra = await User.create({
	id: "mitra",
	title: "Mitra",
  }, USR_BASE, system);
  const USR_ali = await User.create({
	id: "ali",
	title: "Ali",
  }, USR_BASE, system);
  const USR_saeed = await User.create({
	id: "saeed",
	title: "Saeed",
  }, USR_BASE, system);
  const USR_zahra = await User.create({
	id: "zahra",
	title: "Zahra",
  }, USR_BASE, system);
  const USR_fateme = await User.create({
	id: "fateme",
	title: "Fateme",
  }, USR_BASE, system);
  const USR_home = await User.create({
	id: "home",
	title: "Home",
  }, USR_BASE, system);
  const USR_sekeZ = await User.create({
	id: "sekeZ",
	title: "Seke Zahra",
  }, USR_BASE, system);

  system.managerShare!.user = USR_manager.id;
  system.charityShare!.user = USR_charity.id;

  // PISHTAZ | SRC1
  await (async function Pishtaz_Src1() {
	const source = await Source.create({
	  id: 'pish1', title: 'pishtaz_src1', company: PISHTAZ, login: 'h.kh',
	  reinvest: {product: PIS_PRD_1th_12m_reinvest, minInterval: -1, minCount: 1},
	}, undefined, system);

	const USR_hossein = await User.create({
	  id: 'hossein', title: 'Hossein', savePolicy: {rate: 0.3, start: 30 * 12},
	}, USR_BASE, system);

	await Worker.createWorkerFromProduct({
	  source, product: PIS_PRD_4th_12m_old,
	  owners: USR_hossein,
	  startTime: 0,
	  count: 1,
	  purchase: {factor: "3467", date: "10/12/1399", type: "buy"},
	}, system);

	await Worker.createWorkerFromProduct({
	  source, product: PIS_PRD_1th_12m_reinvest,
	  owners: USR_hossein,
	  startTime: 32,
	  count: 1,
	  purchase: {factor: "4248", date: "12/01/1400", type: "reinvest"},
	}, system);

	await Worker.createWorkerFromProduct({
	  source, product: PIS_PRD_1th_12m_reinvest,
	  owners: USR_hossein,
	  startTime: 35,
	  count: 10,
	  purchase: {factor: "XxX", date: "15/01/1400", type: "reinvest"},
	}, system);

	const liveWallet = (await Wallet.find({source, coin: BTC, type: 'live'}, system))!;
	liveWallet.value = 0;
	liveWallet.lastUpdate = 35;
  })();

  // HAMYAR | SRC1
  await (async function Hamyar_Src1() {
	const source = await Source.create({
	  id: 'ham_s1', title: 'ham_src1', company: HAMYAR, login: 'h.kh',
	  reinvest: {product: HAMYAR_PRD_1th_6m, minInterval: -1, minCount: 5},
	}, undefined, system);

	await Worker.createWorkerFromProduct({
	  source, startTime: 0,
	  owners: USR_hossain,
	  purchase: {
		factor: "151993", date: "10/12/1399", type: "buy",
		product: HAMYAR_PRD_1th_6m, count: 5, price: 1.5, priceCoin: M_IRT,
	  },
	}, system);

	await Worker.createWorkerFromProduct({
	  source, startTime: 0,
	  owners: USR_ali,
	  purchase: {
		factor: "152107", date: "10/12/1399", type: "buy",
		product: HAMYAR_PRD_1th_6m, count: 10, price: 3, priceCoin: M_IRT,
	  },
	}, system);

	await Worker.createWorkerFromProduct({
	  source, startTime: 1,
	  owners: {[USR_hossain.id]: 0.75, [USR_mitra.id]: 0.25},
	  purchase: {
		factor: "152326", date: "11/12/1399", type: "buy",
		product: HAMYAR_PRD_1th_6m, count: 20, price: 6, priceCoin: M_IRT,
	  },
	}, system);

	await Worker.createWorkerFromProduct({
	  source, startTime: 11,
	  owners: USR_sekeZ,
	  purchase: {
		factor: "154382", date: "21/12/1399", type: "buy",
		product: HAMYAR_PRD_1th_6m, count: 50, price: 15, priceCoin: M_IRT,
	  },
	}, system);

	await Worker.createWorkerFromProduct({
	  source, startTime: 13,
	  owners: {[USR_mitra.id]: 5 / 35, [USR_fateme.id]: 30 / 35},
	  purchase: {
		factor: "154849", date: "23/12/1399", type: "reinvest",
		product: HAMYAR_PRD_1th_6m, count: 5, price: 1.5, priceCoin: M_IRT,
	  },
	}, system);

	await Worker.createWorkerFromProduct({
	  source, startTime: 16,
	  owners: USR_saeed.id,
	  purchase: {
		factor: "155951", date: "26/12/1399", type: "buy",
		product: HAMYAR_PRD_1th_6m, count: 13.6, price: 5.1, priceCoin: M_IRT,
	  },
	}, system);

	await Worker.createWorkerFromProduct({
	  source, startTime: 17,
	  owners: {
		[USR_hossain.id]: 0.965 / 5,
		[USR_mitra.id]: 0.276 / 5,
		[USR_ali.id]: 0.483 / 5,
		[USR_saeed.id]: 0.656 / 5,
		[USR_fateme.id]: 0.207 / 5,
		[USR_sekeZ.id]: 2.413 / 5,
	  },
	  purchase: {
		factor: "156208", date: "27/12/1399", type: "reinvest",
		product: HAMYAR_PRD_1th_6m, count: 5, price: 1.775, priceCoin: M_IRT,
	  },
	}, system);

	await Worker.createWorkerFromProduct({
	  source, startTime: 17,
	  owners: {
		[USR_hossain.id]: 9.600 / 27.2,
		[USR_mitra.id]: 6.940 / 27.2,
		[USR_saeed.id]: 2.660 / 27.2,
		[USR_zahra.id]: 8.00 / 27.2,
	  },
	  purchase: {
		factor: "156235", date: "27/12/1399", type: "buy",
		product: HAMYAR_PRD_1th_6m, count: 27.2, price: 10.2, priceCoin: M_IRT,
	  },
	}, system);

	await Worker.createWorkerFromProduct({
	  source, startTime: 19,
	  owners: {
		[USR_hossain.id]: 0.266 / 13.6,
		[USR_mitra.id]: 13.334 / 13.6,
	  },
	  purchase: {
		factor: "156450", date: "29/12/1399", type: "buy",
		product: HAMYAR_PRD_1th_6m, count: 13.6, price: 5.1, priceCoin: M_IRT,
	  },
	}, system);

	await Worker.createWorkerFromProduct({
	  source, startTime: 19,
	  owners: USR_hossain,
	  purchase: {
		factor: "156451", date: "29/12/1399", type: "buy",
		product: HAMYAR_PRD_1th_6m, count: 13.6, price: 5.1, priceCoin: M_IRT,
	  },
	}, system);

	await Worker.createWorkerFromProduct({
	  source, startTime: 20,
	  owners: {
		[USR_hossain.id]: 1.635 / 6,
		[USR_mitra.id]: 0.967 / 6,
		[USR_ali.id]: 0.386 / 6,
		[USR_saeed.id]: 1.929 / 6,
		[USR_zahra.id]: 0.294 / 6,
		[USR_fateme.id]: 0.166 / 6,
		[USR_home.id]: 0 / 6,
		[USR_sekeZ.id]: 0.623 / 6,
	  },
	  purchase: {
		factor: "156643", date: "27/12/1399", type: "reinvest",
		product: HAMYAR_PRD_1th_6m, count: 6, price: 2.130, priceCoin: M_IRT,
	  },
	}, system);

	await Worker.createWorkerFromProduct({
	  source, startTime: 22,
	  owners: USR_ali,
	  purchase: {
		factor: "156848", date: "02/01/1400", type: "buy",
		product: HAMYAR_PRD_1th_6m, count: 13.6, price: 5.1, priceCoin: M_IRT,
	  },
	}, system);

	await Worker.createWorkerFromProduct({
	  source, startTime: 24,
	  owners: {
		[USR_hossain.id]: 1.766 / 7,
		[USR_mitra.id]: 1.044 / 7,
		[USR_ali.id]: 0.938 / 7,
		[USR_saeed.id]: 0.722 / 7,
		[USR_zahra.id]: 0.318 / 7,
		[USR_fateme.id]: 0.179 / 7,
		[USR_home.id]: 0 / 7,
		[USR_sekeZ.id]: 2.033 / 7,
	  },
	  purchase: {
		factor: "157259", date: "04/01/1400", type: "reinvest",
		product: HAMYAR_PRD_1th_6m, count: 7, price: 2.359, priceCoin: M_IRT,
	  },
	}, system);

	await Worker.createWorkerFromProduct({
	  source, startTime: 26,
	  owners: {
		[USR_hossain.id]: 1.261 / 5,
		[USR_mitra.id]: 0.746 / 5,
		[USR_ali.id]: 0.670 / 5,
		[USR_saeed.id]: 0.516 / 5,
		[USR_zahra.id]: 0.227 / 5,
		[USR_fateme.id]: 0.128 / 5,
		[USR_home.id]: 0 / 5,
		[USR_sekeZ.id]: 1.452 / 5,
	  },
	  purchase: {
		factor: "157500", date: "06/01/1400", type: "reinvest",
		product: HAMYAR_PRD_1th_6m, count: 5, price: 1.685, priceCoin: M_IRT,
	  },
	}, system);

	await Worker.createWorkerFromProduct({
	  source, startTime: 26,
	  owners: {
		[USR_hossain.id]: 1.261 / 5,
		[USR_mitra.id]: 0.746 / 5,
		[USR_ali.id]: 0.670 / 5,
		[USR_saeed.id]: 0.516 / 5,
		[USR_zahra.id]: 0.227 / 5,
		[USR_fateme.id]: 0.128 / 5,
		[USR_home.id]: 0 / 5,
		[USR_sekeZ.id]: 1.452 / 5,
	  },
	  purchase: {
		factor: "157501", date: "06/01/1400", type: "reinvest",
		product: HAMYAR_PRD_1th_6m, count: 5 - 5, price: 1.685, priceCoin: M_IRT,
	  },
	}, system);

	await Worker.createWorkerFromProduct({
	  source, startTime: 28,
	  owners: {
		[USR_hossain.id]: 1.513 / 6,
		[USR_mitra.id]: 0.895 / 6,
		[USR_ali.id]: 0.804 / 6,
		[USR_saeed.id]: 0.619 / 6,
		[USR_zahra.id]: 0.273 / 6,
		[USR_fateme.id]: 0.153 / 6,
		[USR_home.id]: 0.000 / 6,
		[USR_sekeZ.id]: 1.743 / 6,
	  },
	  purchase: {
		factor: "158123", date: "08/01/1400", type: "reinvest",
		product: HAMYAR_PRD_1th_6m, count: 6, price: 2.022, priceCoin: M_IRT,
	  },
	}, system);

	await Worker.createWorkerFromProduct({
	  source, startTime: 28,
	  owners: {
		[USR_hossain.id]: 1.513 / 6,
		[USR_mitra.id]: 0.895 / 6,
		[USR_ali.id]: 0.804 / 6,
		[USR_saeed.id]: 0.619 / 6,
		[USR_zahra.id]: 0.273 / 6,
		[USR_fateme.id]: 0.153 / 6,
		[USR_home.id]: 0.000 / 6,
		[USR_sekeZ.id]: 1.743 / 6,
	  },
	  purchase: {
		factor: "158124", date: "08/01/1400", type: "reinvest",
		product: HAMYAR_PRD_1th_6m, count: 6, price: 2.022, priceCoin: M_IRT,
	  },
	}, system);

	await Worker.createWorkerFromProduct({
	  source, startTime: 28,
	  owners: {
		[USR_hossain.id]: 1.513 / 6,
		[USR_mitra.id]: 0.895 / 6,
		[USR_ali.id]: 0.804 / 6,
		[USR_saeed.id]: 0.619 / 6,
		[USR_zahra.id]: 0.273 / 6,
		[USR_fateme.id]: 0.153 / 6,
		[USR_home.id]: 0.000 / 6,
		[USR_sekeZ.id]: 1.743 / 6,
	  },
	  purchase: {
		factor: "158125", date: "08/01/1400", type: "reinvest",
		product: HAMYAR_PRD_1th_6m, count: 6 - 6, price: 2.022, priceCoin: M_IRT,
	  },
	}, system);

	await Worker.createWorkerFromProduct({
	  source, startTime: 32,
	  owners: {
		[USR_hossain.id]: 1.765 / 7,
		[USR_mitra.id]: 1.044 / 7,
		[USR_ali.id]: 0.938 / 7,
		[USR_saeed.id]: 0.722 / 7,
		[USR_zahra.id]: 0.318 / 7,
		[USR_fateme.id]: 0.180 / 7,
		[USR_home.id]: 0.000 / 7,
		[USR_sekeZ.id]: 2.033 / 7,
	  },
	  purchase: {
		factor: "159368", date: "12/01/1400", type: "reinvest",
		product: HAMYAR_PRD_1th_6m, count: 7, price: 2.359, priceCoin: M_IRT,
	  },
	}, system);

	// in day 29 - account reach 0 from neg value ! so it's a good start point
	// in day 32 - account reach 0 from neg value ! so it's a good start point
	const liveWallet = (await Wallet.find({source, coin: BTC, type: 'live'}, system))!;
	liveWallet.value = 0;
	liveWallet.lastUpdate = 32;
  })();

  // HAMYAR | VAM1
  await (async function Hamyar_VAM1() {
	const source = await Source.create({
	  id: 'ham_v1', title: 'HAM_SRC_VAM_1', company: HAMYAR, login: 'accHossainSec',
	  reinvest: {product: HAMYAR_PRD_1th_6m, minCount: 5, minInterval: -1},
	}, undefined, system);

	const baseUser = await User.create({
	  id: 'base', savePolicy: [{start: 30 * 18, rate: 0.5}, {start: 30 * 12, rate: 0.4}, {start: 30 * 6, rate: 0.3}],
	});
	const usr_hos = await User.create({id: 'hos', title: 'HOS'}, baseUser, system);
	const usr_mit = await User.create({id: 'mit', title: 'MIT'}, baseUser, system);

	await Worker.reinvestWorkerFromProduct({
	  source, product: HAMYAR_PRD_1th_6m,
	  owners: usr_hos,
	  startTime: 32,
	  count: 89,
	  purchase: {factor: "159366", date: "12/01/1400"},
	}, system);

	await Worker.reinvestWorkerFromProduct({
	  source, product: HAMYAR_PRD_1th_6m,
	  owners: usr_mit,
	  startTime: 32,
	  count: 10,
	  purchase: {factor: "159464", date: "12/01/1400"},
	}, system);
  }());

  // HAMYAR | VAM2
  await (async function Hamyar_VAM2() {
	const source = await Source.create({
	  id: 'ham_v2', title: 'HAM_SRC_VAM_2', company: HAMYAR, login: 'sco75',
	  reinvest: {product: HAMYAR_PRD_1th_6m, minCount: 5, minInterval: -1},
	}, undefined, system);

	const baseUser = await User.create({
	  id: 'base', savePolicy: [{start: 30 * 18, rate: 0.5}, {start: 30 * 12, rate: 0.4}, {start: 30 * 6, rate: 0.3}],
	});
	const usr_sae = await User.create({id: 'sae', title: 'SAE'}, baseUser, system);

	await Worker.reinvestWorkerFromProduct({
	  source, product: HAMYAR_PRD_1th_6m,
	  owners: usr_sae,
	  startTime: 32,
	  count: 148,
	  purchase: {factor: "???", date: "12/01/1400"},
	}, system);
  }());


  // Init
  await (async function Init() {
	// init system
	system.startDate = system.startDate || system.workers.minBy((it: Worker) => it.startTime)?.purchase.date || '???';
	system.currentTime = system.currentTime || system.workers.maxBy((it: Worker) => it.startTime)?.startTime || 0;
  }());

  // test
  await (async function test() {
	const system = await System.create();// system;

	system.workers = [];
	system.currentTime = 0;


	const usrs = ['hos'/*, 'mit', 'ali', 'sae', 'zah', 'fat'*/];
	const baseCount = 20;
	const reInvestProduct = HAMYAR_PRD_1th_6m;
	//const prds: (Product | string) | (([Product | string, number?] | (Product | string))[]) =
	//[[Hamyar.prd_1th_6m_reinvest, 45], [Hamyar.prd_1th_12m_reinvest, 15]];
	const prds: (Product | string) | (([Product | string, number?] | (Product | string))[]) =
	  [[HAMYAR_PRD_1th_6m, 100]];

	let products: [Product, number][] = (
	  (Array.isArray(prds) ? prds : [prds])
		.map(el => Array.isArray(el) ? el : [el])
		.map(([prd, count]) => [typeof prd != "string" ? prd : Product.findById(prd, system) || errVal("product not found"), count || baseCount])
	) as any;

	await usrs.forEachAwait(async id => {
	  const source = await Source.create({
		id: 'ham_t_' + id, company: HAMYAR, reinvest: {product: reInvestProduct},
	  }, undefined, system);
	  const user = await User.create({
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

	  await products.forEachAwait(async ([product, count]) => {
		const coin = product.mineCoin;
		const worker = await Worker.createWorkerFromProduct({
		  source, product, count,
		  owners: user, startTime: system.currentTime,
		}, system);
		const liveWallet = (await Wallet.find({source, coin, type: 'live'}, system))!;
		const workingWallet = (await Wallet.find({source, coin, user, type: 'working'}, system))!;
		const cost = await Coin.exchange(worker.purchase.price, product.priceCoin, coin, system);
		liveWallet.value -= cost;
		workingWallet.value -= cost;
	  });
	});
  }());

});
