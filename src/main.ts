#! /usr/bin/env -S deno run -A --unstable

//region [Boot]
import {System} from "./lib/System.ts";
import {baseSystem} from './baseSystem.ts';
import {calculateRates} from './pages/RatePage.ts';

System.set(baseSystem);


await calculateRates({});
//endregion

//region [Main]
import {showMainPage} from "./pages/MainPage.ts";

await showMainPage();

console.log("goodbye");
//endregion
