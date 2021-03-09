import { newPerson, newWorker, Person, System, Worker } from './lib/index.ts';

const persons: Person[] = [
  newPerson({
    id: 'H',
    title: 'Hossain',
    profit_share: 1.0,
    invest: {
      save_rate: 0.30,
    },
  }),

  newPerson({
    id: 'A',
    title: 'Ali',
    profit_share: 0.7,
    invest: {
      save_rate: 0.30,
    },
  }),

  newPerson({
    id: 'M',
    title: 'M',
    profit_share: 0.7,
    invest: {
      save_rate: 0.30,
    },
  }),
];

const workers: Worker[] = [
  newWorker({
    power: 4.0,
    buy_company: 'pishtaz',
    buy_price: 1800.0,
    buy_start_day: 0,
    buy_end_day: 0 + 365,
    owners: {
      'H': 1,
    },
  }),

  newWorker({
    power: 5.0,
    buy_company: 'hamyar',
    buy_price: 1500.0,
    buy_start_day: 0,
    buy_end_day: 0 + 30 * 6,
    owners: {
      'H': 1,
    },
  }),

  newWorker({
    power: 10.0,
    buy_company: 'hamyar',
    buy_price: 3000.0,
    buy_start_day: 0,
    buy_end_day: 0 + 30 * 6,
    owners: {
      'A': 1,
    },
  }),

  newWorker({
    power: 15.0,
    buy_company: 'hamyar',
    buy_price: 4500.0,
    buy_start_day: 0,
    buy_end_day: 0 + 30 * 6,
    owners: {
      'H': 0.66,
      'M': 0.34,
    },
  }),
];

const system = <System> {
  start_day_date: 0,
  current_day: 0,
  daily_power_profit: 0.0000029886,
  manager_person_id: 'H',

  persons,
  workers,
};

export default system;
