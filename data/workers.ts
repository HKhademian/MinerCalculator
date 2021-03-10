import { newWorker, newWorkerFromProduct, Worker } from "../lib/Worker.ts";
import { hamyar_5th } from "./companies.ts";

export const workers: Worker[] = [
  newWorkerFromProduct({
    product: hamyar_5th,
    owners: { "home": 1 },
    start_day: 15,
    count: 10,
  }),
  //
  // newWorkerFromProduct({
  //   product: hamyar_5th,
  //   owners: { "hossain": 1 },
  //   start_day: 0,
  //   count: 4,
  // }),
  //
  // newWorkerFromProduct({
  //   product: hamyar_5th,
  //   owners: { "ali": 1 },
  //   start_day: 0,
  //   count: 2,
  // }),
  //
  // newWorkerFromProduct({
  //   product: hamyar_5th,
  //   owners: { "mitra": 1 },
  //   start_day: 0,
  //   count: 1,
  // }),
];
