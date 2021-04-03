import {askMenu} from "../util.ts";
import {System} from "../lib/System.ts";

export const showUserPage = async () => await askMenu(
  "User Page", [
	{title: "exit User Page"},
  ], async () => {
	const system = await System.get();
	console.log(system.users);
  }, {defaultChoice: 0});
