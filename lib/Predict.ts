import { DeepPartial, newWorkerFromProduct, User, System } from "./index.ts";

export const predict = (source_system: System, days: number = 30): System => {
  // const system = { ...source_system } as System;
  const system = JSON.parse(JSON.stringify(source_system)) as System;

  for (let i = 0; i < days; i++) {
    system.current_day++;

    // holds income of current itteration
    const incomes: { [key: string]: number } = {};
    // fill each user profit to 0.0
    system.users.forEach((it) => incomes[it.id] = 0.0);
    //console.error(incomes);

    // calculate each active miner profit
    system.workers
      .filter((it) => it.buy_end_day > system.current_day)
      .forEach((worker) => {
        // total mine income from current miner in a time period
        const worker_income = worker.power *
          system.daily_power_profit *
          worker.efficiency;
        // console.log({worker_income, owners: worker.owners});

        for (const owner_id in worker.owners) {
          const owner_share = worker.owners[owner_id];
          const owner_user = system.users.find((it) =>
            it.id == owner_id
          ) as User;

          // profit for this share
          let share_profit = owner_share * worker_income;
          // owner share from this miner profit
          let owner_profit = share_profit * owner_user.profit_share;
          // manager share from this miner/owner profit
          let manager_profit = share_profit - owner_profit;

          incomes[owner_id] += owner_profit;
          incomes[system.manager_user_id] += manager_profit;

          //console.log({owner_id, share_profit, owner_profit, manager_profit});
        }
      });

    //console.error(incomes);
    for (const user_id in incomes) {
      const user = system.users.find((it) => it.id == user_id) as User;

      let income = incomes[user_id];
      let income_working = income;
      let income_saving = 0;

      if (
        (user.settings.invest_save_start < 0 ||
          user.settings.invest_save_start < system.current_day) &&
        (user.settings.invest_save_end < 0 ||
          user.settings.invest_save_end > system.current_day)
      ) {
        income_saving = income * user.invest.save_rate;
        income_working -= income_saving;
      }

      user.working_wallet += income_working;
      user.saving_wallet += income_saving;
    }

    // reinvest
    const product = system.products[0];
    const invest_wallet = system.users.map((it) => it.working_wallet).reduce(
      (a, b) => a + b,
      0.0,
    );
    let new_miner_count = Math.floor(invest_wallet / product.price);
    // console.error({ day:system.current_day,invest_wallet, new_miner_count });

    if (new_miner_count > 0) {
      const order_price = new_miner_count * product.price;
      const price_ratio = order_price / invest_wallet;
      const owners: { [key: string]: number } = {};

      system.users.forEach((user) => {
        const share_price = (user.working_wallet * price_ratio);
        user.working_wallet -= share_price;
        owners[user.id] = Math.round(1000 * share_price / order_price) / 1000;
      });
      const newWorker = newWorkerFromProduct(
        product,
        owners,
        system.current_day,
        new_miner_count,
      );
      console.error({ owners, newWorker });

      system.workers.push(newWorker);
    }
  }

  return system;
};
