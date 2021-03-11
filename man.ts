import { predict } from "./lib/predict.ts";
import { print } from "./lib/util.ts";
import { System } from "./lib/System.ts";
import { Coin, exchange } from "./lib/Coin.ts";
import { kIRT, uBTC } from "./data/coins.ts";
import { system as baseSystem } from "./data/system.ts";

baseSystem.current_day = 0;
print({ baseSystem }, "\n\n\n");

let system: System = baseSystem;

for (let i = 0; i < 24 + 1; i++) {
  let active_workers = system.workers
    .filter((it) => it.buy_end_day > system.current_day)
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
    { active_workers, count, sum_power, sum_power_day, sum_power_year },
    "\n",
  );

  print("User Wallets", {
    current_day: system.current_day,
    saving: system.users.map((it) => ({
      user: it.id,
      "uBTC": it.saving_wallet.toFixed(3),
      "kIRT": exchange(it.saving_wallet, uBTC, kIRT).toFixed(3),
    })),
    working: system.users.map((it) => ({
      user: it.id,
      "uBTC": it.working_wallet.toFixed(3),
      "kIRT": exchange(it.working_wallet, uBTC, kIRT).toFixed(3),
    })),
    worker_power: system.users.map((it) => ({
      user: it.id,
      "TH/s": active_workers.reduce(
        (prev, el) => prev + el.power * (el.owners[it.id] || 0),
        0,
      ).toFixed(3),
    })),
  }, "\n");

  system = predict(system, 30);

  alert("any to continue");
}
