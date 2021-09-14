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
import {showPredict} from "./pages/PredictPage.ts";

const TEST = !!Deno.env.get('PROD');


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
	price: 0.420,
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


  const BASE_POLICY = [{
	end: 30 * 3,
	rate: 1,
  }, {
	end: 30 * 6,
	rate: 0,
  }, {
	start: 30 * 12,
	rate: 0.40,
  }, {
	rate: 0.30,
  }];

  const USR_BASE: User = await User.create({
	id: "base",
	title: "Base User",
	savePolicy: BASE_POLICY,
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
  const USR_ali = await User.create({
	id: "ali",
	title: "Ali",
  }, USR_BASE, system);
  const USR_saeed = await User.create({
	id: "saeed",
	title: "Saeed",
  }, USR_BASE, system);

  system.managerShare!.user = USR_manager.id;
  system.charityShare!.user = USR_charity.id;

  // HAMYAR | VAM2
  await (async function Hamyar_VAM2() {
	const source = await Source.create({
	  id: 'ham_v2', title: 'HAM_SRC_VAM_2', company: HAMYAR, login: 'sco75',
	  reinvest: {product: HAMYAR_PRD_1th_6m, minCount: 5, minInterval: -1},
	}, undefined, system);

	const baseUser = await User.create({
	  id: 'base', savePolicy: {rate: 0.3},
	});
	const usr_sae = await User.create({id: 'sae', title: 'SAE'}, baseUser, system);

	await Worker.reinvestWorkerFromProduct({
	  source, startTime: 32, owners: usr_sae,
	  purchase: {
		factor: "???", date: "12/01/1400", type: "reinvest",
		product: HAMYAR_PRD_1th_6m, count: 148, price: 48.500, priceCoin: M_IRT,
	  },
	}, system);

	await Worker.reinvestWorkerFromProduct({
	  source, startTime: 36, owners: usr_sae,
	  purchase: {
		factor: "???", date: "16/01/1400", type: "reinvest",
		product: HAMYAR_PRD_1th_6m, count: 48, price: 20.000, priceCoin: M_IRT,
	  },
	}, system);
  }());

  // HAMYAR | VAM3
  await (async function Hamyar_VAM3() {
	const source = await Source.create({
	  id: 'ham_v3', title: 'HAM_SRC_VAM_3', company: HAMYAR, login: 'hco',
	  reinvest: {product: HAMYAR_PRD_1th_6m, minCount: 5, minInterval: -1},
	}, undefined, system);

	const baseUser = await User.create({
	  id: 'base', savePolicy: {start: 30 * 6, rate: 0.3},
	});
	const usr_hco = await User.create({id: 'hco', title: 'HCo'}, baseUser, system);

	await Worker.createWorkerFromProduct({
	  source, startTime: 40, owners: usr_hco,
	  purchase: {
		factor: "???", date: "20/01/1400", type: "reinvest",
		product: HAMYAR_PRD_1th_6m, count: 11.1, price: 5.000, priceCoin: M_IRT,
	  },
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


	const usrs = ['hos'/*, 'ali', 'sae'*/];
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
