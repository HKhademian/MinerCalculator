import { Coin } from "./Coin.ts";
import { User } from "./User.ts";
import { Product } from "./Product.ts";
import { Worker } from "./Worker.ts";

export interface System {
  coins: Coin[];
  products: Product[];
  users: User[];
  workers: Worker[];
  start_day_date: number;
  current_day: number;
  daily_power_profit: number;
}
