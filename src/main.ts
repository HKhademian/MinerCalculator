#! /usr/bin/env -S deno run -A --unstable

//region [Boot]
import './lib/_global.ts';
import {System} from "./lib/System.ts";
import {baseSystem} from './baseSystem.ts';
import {Routines} from "./lib/Routines.ts";

await System.set(baseSystem);

await Routines.calculateRates({});
//endregion

//region [Main]
import {showMainPage} from "./pages/MainPage.ts";

await showMainPage();

console.log("goodbye");
//endregion
