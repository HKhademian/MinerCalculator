import { newWorker, newWorkerFromProduct, Worker } from "../lib/Worker.ts";
import { hamyar_5th_12m, hamyar_5th_6m, pishtaz_4th_12m } from "./companies.ts";

export type { Worker };

// export const products = [hamyar_5th_6m, hamyar_5th_12m];
//
// export const workers: Worker[] = [
//   newWorkerFromProduct({
//     product: hamyar_5th_6m,
//     owners: { "hossain": 1 },
//     start_day: 0, /*0*/
//     count: 1,
//   }),
//
//   newWorkerFromProduct({
//     product: hamyar_5th_6m,
//     owners: { "ali": 1 },
//     start_day: 0, /*2*/
//     count: 2,
//   }),
//
//   newWorkerFromProduct({
//     product: hamyar_5th_6m,
//     owners: { "hossain": 1 },
//     start_day: 0, /*3*/
//     count: 3,
//   }),
//
//   newWorkerFromProduct({
//     product: hamyar_5th_6m,
//     owners: { "mitra": 1 },
//     start_day: 0, /*3*/
//     count: 1,
//   }),
//
//   newWorkerFromProduct({
//     product: hamyar_5th_6m,
//     owners: { "home": 1 },
//     start_day: 0,
//     count: 10,
//   }),
//   //
//   // newWorkerFromProduct({
//   //   product: hamyar_5th,
//   //   owners: { "hossain": 0.5, "mitra": 0.5 },
//   //   start_day: 30,
//   //   count: 7,
//   // }),
// ];

// export const products = [hamyar_5th_6m, hamyar_5th_12m];
// export const workers: Worker[] = [
//   newWorkerFromProduct({
//     product: hamyar_5th_6m,
//     owners: { "zahra": 1 },
//     start_day: 0,
//     count: Math.ceil(20_000 / 1_500),
//   }),
// ];

export const products = [pishtaz_4th_12m];
export const workers: Worker[] = [
  //   newWorkerFromProduct({
  //     product: pishtaz_4th_12m,
  //     owners: { "hossain": 1 },
  //     start_day: 0, /*0*/
  //     count: 1,
  //   }),
  //
  newWorkerFromProduct({
    product: pishtaz_4th_12m,
    owners: { "zahra": 1 },
    start_day: 0,
    count: Math.ceil(20_000 / 1_800),
  }),
];
