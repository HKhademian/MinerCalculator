import type {System} from './lib/System.ts';
import {askMenu} from "./util.ts";
import {showRatePage} from "./rates.ts";
import {showPredict} from './Predict.ts';

export const mainMenu = async () => await askMenu(
  "Main Menu", [
	{title: "exit APP"},
	{title: "System", action: () => showSystemPage()},
	{title: "Coins & Rates", action: () => showRatePage()},
	{title: "Users", action: () => showUserPage()},
	{title: "Workers", action: () => showWorkerPage()},
	{title: "Predict System", action: () => showPredict()},
  ], undefined,
  {defaultChoice: 0, autoClear: true});

export const showUserPage = async () => await askMenu(
  "User Page", [
	{title: "exit User Page"},
  ], () => {
	const system: System = (globalThis as any).system;
	console.log(system.users);
  }, {defaultChoice: 0});

export const showWorkerPage = async () => await askMenu(
  "Worker Page", [
	{title: "exit Worker Page"},
  ], () => {
	const system: System = (globalThis as any).system;
	console.log(system.workers);
  }, {defaultChoice: 0});

export const showSystemPage = async () => await askMenu(
  "System Page", [
	{title: "exit System Page"},
  ], () => {
	const system: System = (globalThis as any).system;
	console.log(system);
  }, {defaultChoice: 0});
