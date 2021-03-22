import {askMenu} from "../util.ts";
import {System} from "../lib/System.ts";

export const showSystemPage = async () => await askMenu(
  "System Page", [
	{title: "exit System Page"},
  ], () => {
	const system: System = (globalThis as any).system;
	console.log(system);
  }, {defaultChoice: 0});
