import { System } from "../lib/System.ts";
import { coins } from "./coins.ts";
import { users } from "./users.ts";
import { products, workers } from "./workers.ts";

export type { System };

export const system: System = {
  coins,
  products,
  users,
  workers,
  start_day_date: 0,
  current_day: 0,
  // daily_power_profit: 0.000005805,
  daily_power_profit: 5.805,
} as System;

// console.log(system);
