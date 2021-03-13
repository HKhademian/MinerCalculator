import { predict } from "./lib/predict.ts";
import { print } from "./lib/util.ts";
import { exchange, kIRT, uBTC } from "./data/coins.ts";
import { System, system as baseSystem } from "./data/system.ts";

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

  const report = system.users.map((it) => ({
    user: it.id,
    "save uBTC": it.saving_wallet.toFixed(3),
    "save kIRT": exchange(it.saving_wallet, uBTC, kIRT).toFixed(3),
    "work uBTC": it.working_wallet.toFixed(3),
    "work kIRT": exchange(it.working_wallet, uBTC, kIRT).toFixed(3),
    "TH/s": active_workers.reduce(
      (prev, el) => prev + el.power * (el.owners[it.id] || 0),
      0,
    ).toFixed(3),
  })).filter((it) =>
    parseFloat(it["save uBTC"]) > 0 || parseFloat(it["work uBTC"]) > 0 ||
    parseFloat(it["TH/s"]) > 0
  );
  if (report.length > 1) {
    let sum = {
      user: "--SUM--",
      "save uBTC": report.reduce((p, x) => p + parseFloat(x["save uBTC"]), 0)
        .toFixed(3),
      "save kIRT": report.reduce((p, x) => p + parseFloat(x["save kIRT"]), 0)
        .toFixed(3),
      "work uBTC": report.reduce((p, x) => p + parseFloat(x["work uBTC"]), 0)
        .toFixed(3),
      "work kIRT": report.reduce((p, x) => p + parseFloat(x["work kIRT"]), 0)
        .toFixed(3),
      "TH/s": report.reduce((p, x) => p + parseFloat(x["TH/s"]), 0).toFixed(3),
    };
    report.push({
      user: "-------",
      "save uBTC": "-------",
      "save kIRT": "-------",
      "work uBTC": "-------",
      "work kIRT": "-------",
      "TH/s": "-------",
    });
    report.push(sum);
  }

  print("User States", { current_day: system.current_day });
  console.table(report);
  print("\n\n");

  system = predict(system, 30);
  // @ts-ignore
  alert("any to continue");
}
