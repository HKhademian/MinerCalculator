import { newUser, User } from './lib/index.ts';
import { newProduct, Product } from './lib/index.ts';
import { newWorker, newWorkerFromProduct, Worker } from './lib/index.ts';
import { System } from './lib/index.ts';

const hamyar5th = newProduct({
  company: 'hamyar',
  life: 30 * 6,
  price: 0.001187381931495207,
  power: 5.0,
  efficiency: 0.51,
});

const products: Product[] = [
  hamyar5th,
];

const users: User[] = [
  newUser({
    id: 'hossain',
    title: 'Hossain Khademian',
    settings: {
      invest_save_rate: 0.30,
      invest_save_start: 30 * 3,
    },
  }),

  newUser({
    id: 'ali',
    title: 'Ali Khademian',
    agentUserId: 'hossain',
    agent_share: 0.2,
    settings: {
      invest_save_rate: 0.30,
      invest_save_start: 30 * 3,
    },
  }),

  newUser({
    id: 'mitra',
    title: 'Mitra',
    agentUserId: 'hossain',
    agent_share: 0.2,
    settings: {
      invest_save_rate: 0.30,
      invest_save_start: 30 * 3,
    },
  }),
];

const workers: Worker[] = [
  // newWorker({
  //   power: 4.0,
  //   buy_company: 'pishtaz',
  //   buy_price: 1800.0,
  //   buy_start_day: 0,
  //   buy_end_day: 0 + 365,
  //   owners: {
  //     'hossain': 1,
  //   },
  // }),

  newWorkerFromProduct({
    product: hamyar5th,
    owners: {
      'test': 1,
    },
  }),

  newWorkerFromProduct({
    product: hamyar5th,
    owners: {
      'hossain': 1,
    },
    start_day: 0,
    count: 4,
  }),

  newWorkerFromProduct({
    product: hamyar5th,
    owners: {
      'ali': 1,
    },
    start_day: 0,
    count: 2,
  }),

  newWorkerFromProduct({
    product: hamyar5th,
    owners: {
      'mitra': 1,
    },
    start_day: 0,
    count: 1,
  }),
];

const system = <System> {
  start_day_date: 0,
  current_day: 0,
  daily_power_profit: 0.000005805,
  manager_user_id: 'hossain',

  products,
  users, 
  workers,
};

// console.log(system);

export default system;
