import {askMenu} from "../util.ts";
import {System} from "../lib/System.ts";

export const showUserPage = async () => await askMenu(
  "User Page", [
	{title: "exit User Page"},
  ], () => {
	const system: System = (globalThis as any).system;
	console.log(system.users);
  }, {defaultChoice: 0});
