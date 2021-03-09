import { DeepPartial, User, Product, Worker } from './index.ts';

export interface System {
  products: Product[];
  users: User[];
  workers: Worker[];
  start_day_date: number;
  current_day: number;
  daily_power_profit: number;
  manager_user_id: string;
}
