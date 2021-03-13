import { print } from "./util.ts";
import { System } from "./System.ts";
import { User } from "./User.ts";
import { newWorkerFromProduct, Worker } from "./Worker.ts";

const PREC = 100000;
const MIN_BUY_INT = 7;

export const predict = (source_system: System, days: number = 30): System => {
  // const system = { ...source_system } as System;
  const system = JSON.parse(JSON.stringify(source_system)) as System;

  let lastBuy = 0;

  for (let i = 0; i < days; i++) {
    system.current_day++;

    // holds income of current iteration
    const incomes: { [key: string]: number } = {};
    // fill each user profit to 0.0
    system.users.forEach((it) => incomes[it.id] = 0.0);
    //print(incomes);

    // calculate each active miner profit
    system.workers
      .filter((it) => it.buy_start_day < system.current_day)
      .filter((it) => it.buy_end_day > system.current_day)
      .forEach((worker) => {
        // total mine income from current miner in a time period
        const worker_income = worker.power *
          system.daily_power_profit *
          worker.efficiency;
        //print({worker_income, owners: worker.owners});

        for (const owner_id in worker.owners) {
          const owner_share = worker.owners[owner_id];
          const owner_user = system.users.find((it) =>
            it.id == owner_id
          ) as User;
          if (!owner_user) continue;

          // profit for this share
          let share_profit = owner_share * worker_income;
          let agent_profit = 0;
          let owner_profit = share_profit;

          if (owner_user.agentUserId) {
            // agent share from this worker/owner profit
            agent_profit = share_profit * owner_user.agent_share;
            // owner share from this worker profit
            owner_profit = share_profit - agent_profit;
          }

          incomes[owner_id] += owner_profit;

          if (owner_user.agentUserId && agent_profit > 0) {
            incomes[owner_user.agentUserId] += agent_profit;
          }

          //print({owner_id, share_profit, owner_profit, agent_profit});
        }
      });

    //print(incomes);
    for (const user_id in incomes) {
      const user = system.users.find((it) => it.id == user_id) as User;

      let income = incomes[user_id];
      let income_working = 0;
      let income_saving = 0;

      const allowSave = (user.settings.save_start < 0 ||
        user.settings.save_start < system.current_day) &&
        (user.settings.save_end < 0 ||
          user.settings.save_end > system.current_day);
      const allowInvest = (user.settings.invest_start < 0 ||
        user.settings.invest_start < system.current_day) &&
        (user.settings.invest_end < 0 ||
          user.settings.invest_end > system.current_day);

      if (user.settings.save_rate >= 0) {
        income_working = income;
        if (allowSave) {
          income_saving = income * user.settings.save_rate;
          income_working -= income_saving;
        }
      } else if (user.settings.invest_rate >= 0) {
        income_saving = income;
        if (allowInvest) {
          income_working = income * user.settings.invest_rate;
          income_saving -= income_working;
        }
      } else {
        console.error(`Please set save or invest policy for ${user.id}`);
        Deno.exit();
        return {} as System;
      }

      user.working_wallet += income_working;
      user.saving_wallet += income_saving;
    }

    if (system.current_day - lastBuy < MIN_BUY_INT) {
      continue;
    }

    // reinvest
    const product = system.products[0];
    const invest_wallet = system.users.map((it) => it.working_wallet).reduce(
      (a, b) => a + b,
      0.0,
    );
    let new_miner_count = Math.floor(invest_wallet / product.price);
    //print({ lastBuy, day:system.current_day,invest_wallet, new_miner_count });

    if (new_miner_count > 0) {
      const order_price = new_miner_count * product.price;
      const price_ratio = order_price / invest_wallet;
      const owner_share: { [key: string]: number } = {};

      system.users.forEach((user) => {
        const share_price = (user.working_wallet * price_ratio);
        user.working_wallet -= share_price;
        owner_share[user.id] = Math.round(PREC * share_price / order_price) /
          PREC;
      });

      const owners = Object.fromEntries(
        Object.entries(owner_share).filter((it) => it[1] > 0),
      );
      const newWorker = newWorkerFromProduct({
        product,
        owners,
        start_day: system.current_day,
        count: new_miner_count,
      });
      system.workers.push(newWorker);
      lastBuy = system.current_day;

      //print({ lastBuy, owners, newWorker });
    }
  }

  return system;
};
