import {askMenu} from "../util.ts";
import {System} from "../lib/System.ts";

export const showWorkerPage = async () => await askMenu(
  "Worker Page", [
	{title: "exit Worker Page"},
  ], () => {
	const system: System = (globalThis as any).system;
	console.log(system.workers);
  }, {defaultChoice: 0});
