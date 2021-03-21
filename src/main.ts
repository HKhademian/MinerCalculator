#! /usr/bin/env -S deno run -A --unstable

//region [Boot]
import {system as baseSystem} from './baseSystem.ts';
import {calculateRates} from './rates.ts';

(globalThis as any).system = baseSystem;
baseSystem.currentTime = baseSystem.workers.reduce((prev, el) => Math.max(prev, el.startTime), 0) || 0;
baseSystem.startDate = baseSystem.workers.reduce(
  (prev, el) => prev.startTime <= el.startTime ? prev : el,
  baseSystem.workers[0]).purchase.date;

await calculateRates({});
//endregion

//region [Main]
import {mainMenu} from "./menus.ts";

await mainMenu();

console.log("goodbye");
//endregion
