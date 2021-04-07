import {askMenu} from "../util.ts";
import {showRatePage} from "./RatePage.ts";
import {showSavePage, showSystemPage} from "./SystemPage.ts";
import {showUserPage} from "./UserPage.ts";
import {showWorkerPage} from "./WorkerPage.ts";
import {showLabPage} from "./LabPage.ts";

export const showMainPage = async () => await askMenu(
  "Main Menu", [
	{title: "exit APP"},
	{title: "System", action: () => showSystemPage()},
	{title: "Coins & Rates", action: () => showRatePage()},
	{title: "Users", action: () => showUserPage()},
	{title: "Workers", action: () => showWorkerPage()},
	{},
	{title: "LAB", action: () => showLabPage()},
	{},
	{title: "Save Changes", action: () => showSavePage()},
  ],
  undefined, {
	autoClear: true,
  });
