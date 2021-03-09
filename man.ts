import { predict, System, User, Worker } from './lib/index.ts';
import system from './data.ts';

system.current_day = 0;
console.info(system, '\n\n\n');

// let cur = system;
// for (let i = 0; i < 365 / 7; i++) {
//   cur = predict(cur, 7);
//   //   console.info({ current_day: cur.current_day });
//   //   console.info(cur.persons, '\n\n');
// }

// console.info(
//   '\n\n\n',
//   cur.workers
//     .filter((it) => it.buy_end_day > 360)
//     .map((it) => ({
//       start: it.buy_start_day,
//       end: it.buy_end_day,
//       power: it.power,
//       owners: it.owners,
//     })),
//   '\n\n\n',
// );

// console.info('\n\n\n', cur.persons, '\n\n\n');
