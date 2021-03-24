#! /usr/bin/env -S deno run -A --unstable

//region [Boot]
import {calculateRates} from './pages/RatePage.ts';
import {baseSystem} from './baseSystem.ts';

(globalThis as any).system = baseSystem;
baseSystem.currentTime = baseSystem.workers.reduce((prev, el) => Math.max(prev, el.startTime), 0) || 0;
baseSystem.startDate = baseSystem.workers.length <= 0 ? '?' : baseSystem.workers.reduce(
  (prev, el) => prev.startTime <= el.startTime ? prev : el,
  baseSystem.workers[0]).purchase.date;

await calculateRates({});
//endregion

//region [Main]
import {showMainPage} from "./pages/MainPage.ts";

await showMainPage();

console.log("goodbye");
//endregion
