import {askMenu} from "../util.ts";
import {System} from "../lib/System.ts";

export const showSystemPage = async () => await askMenu(
  "System Page", [
	{title: "exit System Page"},
  ], async () => {
	console.log(await System.get());
  }, {defaultChoice: 0});

export const showSavePage = async () => await askMenu(
  "Save System Page", [
	{title: "exit SAVE Page"},
  ], async () => {
	const system = await System.get();
	await System.save(system);
  }, {defaultChoice: 0});
