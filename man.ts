import { predict } from "./lib/predict.ts";
import { print } from "./lib/util.ts";
import { System } from "./lib/System.ts";
import { User } from "./lib/User.ts";
import { Worker } from "./lib/Worker.ts";
import { system } from "./data/system.ts";

system.current_day = 0;
print(system, "\n\n\n");

const endDay = 185;

let cur: System = system as System;
for (let i = 0; i < endDay; i++) {
  cur = predict(cur, 1);
  if (i % 30 == 0) {
    print("User Wallets", {
      current_day: cur.current_day,
      users: cur.users.map((it) => ({
        id: it.id,
        saving: it.saving_wallet,
      })),
    }, "\n\n");
  }
}

{
  let active_workers = cur.workers
    .filter((it) => it.buy_end_day > endDay)
    .map((it) => ({
      start: it.buy_start_day,
      end: it.buy_end_day,
      power: it.power,
      owners: it.owners,
    }));
  let count = active_workers.length;
  let sum_power = active_workers.reduce((prev, el) => prev + el.power, 0);
  let sum_power_day = active_workers.reduce(
    (prev, el) => prev + el.power * (el.end - el.start),
    0,
  );
  let sum_power_year = sum_power_day / 365;

  print(
    "\n\n\nWORKERS\n",
    {
      count,
      sum_power,
      sum_power_day,
      sum_power_year,
    },
    "\n\n\n",
  );
}

for (let i = 0; i < endDay; i++) {
  cur = predict(cur, 1);
  if (i % 30 == 0) {
    print("User Wallets", {
      current_day: cur.current_day,
      users: cur.users.map((it) => ({
        id: it.id,
        saving: it.saving_wallet,
      })),
    }, "\n\n");
  }
}

{
  let active_workers = cur.workers
    .filter((it) => it.buy_end_day > endDay)
    .map((it) => ({
      start: it.buy_start_day,
      end: it.buy_end_day,
      power: it.power,
      owners: it.owners,
    }));
  let count = active_workers.length;
  let sum_power = active_workers.reduce((prev, el) => prev + el.power, 0);
  let sum_power_day = active_workers.reduce(
    (prev, el) => prev + el.power * (el.end - el.start),
    0,
  );
  let sum_power_year = sum_power_day / 365;

  print(
    "\n\n\nWORKERS\n",
    {
      count,
      sum_power,
      sum_power_day,
      sum_power_year,
    },
    "\n\n\n",
  );
}
