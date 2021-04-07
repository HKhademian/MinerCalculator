import {askMenu} from "../util.ts";
import {baseSystem} from "../baseSystem.ts";
import {showPredict} from "./PredictPage.ts";
import {showConsole} from "../lib/Console.ts";
import {System} from "../lib/System.ts";
import {Product} from "../lib/Product.ts";
import {Worker} from "../lib/Worker.ts";

export const showLabPage = async () => askMenu("Lab PAGE", [
  {title: "exit APP"},
  {},
  {title: "Show Console", action: () => showConsole()},
  {title: "Predict System", action: () => showPredict()},
  {title: "test ham_s1", action: () => showTestHamS1Predict()},
  {title: "test ham_v3", action: () => showTestHamV3Predict()},
], undefined, {
  defaultChoice: 0,
});

const showTestHamS1Predict = async () => {
  const system = await System.create(baseSystem || await System.get());
  const product = (await Product.findById('hamyar_1th_6m', system))!;
  const source = 'ham_s1';
  await showPredict({
	system, source, periodLen: 3, onPrePredict: async (system, i) => {
	  const count = (system.currentTime > 140) ? 20 : (system.currentTime > 60) ? 10 : (system.currentTime > 40) ? 5 : 0;

	  count > 0 && await Worker.reinvestWorkerFromProduct({
		source, product, startTime: system.currentTime, count, takeSaving: false,
	  }, system);

	},
  })
};

const showTestHamV3Predict = async () => {
  const system = await System.create(baseSystem || await System.get());
  const product = (await Product.findById('hamyar_1th_6m', system))!;
  const source = 'ham_v3';
  const periodLen = 10;
  system.currentTime = system.workers.filter(it => it.source == source).maxBy(it => it.startTime)?.startTime || 0;
  await showPredict({
	system, source, periodLen, onPrePredict: async (system, i) => {
	  const count = (system.currentTime > 160) ? 20 : (system.currentTime > 130) ? 15 : (system.currentTime > 100) ? 10 : 5;
	  count > 0 && await Worker.reinvestWorkerFromProduct({
		source, product, startTime: system.currentTime, count, takeSaving: false,
	  }, system);

	},
  })
};
