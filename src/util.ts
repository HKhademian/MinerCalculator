// import * as Colors from "https://deno.land/std/fmt/colors.ts";
// import { printf } from "https://deno.land/std/fmt/printf.ts";
import ShortUniqueId from 'https://cdn.jsdelivr.net/npm/short-unique-id@latest/short_uuid/mod.ts';

export {exists} from "https://deno.land/std/fs/mod.ts";
export {v4 as uuid} from "https://deno.land/std/uuid/mod.ts";
export {readCSV, writeCSV} from "https://deno.land/x/csv/mod.ts";

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type StrDict<V> = { [_: string]: V };
export type NumDict<V> = { [_: number]: V };

export const errVal = (msg?: string): never => {
  throw Error(msg)
};

const uid = new ShortUniqueId();
export const generateID = () => uid(6);

export const toPrec = (val: any, prec: number = 3, round: any = Math.round): number => {
  let num: number;
  if (isNaN(val) || val == undefined) {
	num = 0;
  } else {
	const type = typeof val;
	switch (type) {
	  case "number":
		num = val;
		break;
	  case "string":
		num = parseFloat(val);
		break;
	  default:
		num = parseFloat(val.toString());
		break;
	}
  }
  const mult = Math.pow(10, prec);
  return (round || Math.round)(num * mult) / mult;
}

export const print = (...data: unknown[]): void => {
  return console.log(...data);

  // let cen = Colors.getColorEnabled();
  // Colors.setColorEnabled(false);
  // console.log(...data);
  // Colors.setColorEnabled(cen);
  // return;

  // data?.forEach((it) => {
  //   // return printf("%j", it);
  //
  //   if (
  //     typeof (data) == "string" ||
  //     typeof (data) == "number" ||
  //     typeof (data) == "boolean"
  //   ) {
  //     return console.log(it);
  //   }
  //   return console.log(JSON.stringify(it, undefined, "\t"));
  // });
};

export const askMenu = async (header: string, entities: {
  title?: string,
  action?: (() => any),
}[], before?: (() => any), options?: { autoClear?: boolean, defaultChoice?: number }) => {
  if (before) {
	const res = before();
	if (res && res instanceof Promise) await res;
  }
  while (true) {
	if (options?.autoClear) console.clear();
	else console.log();
	console.log(header);
	console.log("*".repeat(25));
	entities.forEach(({title}, index) => title && console.log(`${index}) ${title}`));
	console.log("*".repeat(25));
	// @ts-ignore
	const choose = parseInt(prompt("Please enter menu number:", options?.defaultChoice?.toString()));
	if (choose >= 0 && choose < entities.length) {
	  const {title, action} = entities[choose];
	  if (!action)
		if (!title) continue;
		else break;
	  const res = action();
	  if (res && res instanceof Promise) await res;
	} else {
	  console.error("wrong input\n");
	}
  }
};
