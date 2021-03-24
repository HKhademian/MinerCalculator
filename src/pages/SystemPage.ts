import {askMenu} from "../util.ts";
import {System} from "../lib/System.ts";

export const showSystemPage = async () => await askMenu(
  "System Page", [
	{title: "exit System Page"},
  ], async () => {
	console.log(System.get());
  }, {defaultChoice: 0});

export const showSavePage = async () => await askMenu(
  "Save System Page", [
	{title: "exit SAVE Page"},
  ], async () => {
	const system = System.get();
	const jsonData = JSON.stringify(system, undefined, 2);
	await Deno.writeTextFile("./data/system.json", jsonData);
  }, {defaultChoice: 0});
