// import * as Colors from "https://deno.land/std/fmt/colors.ts";
// import { printf } from "https://deno.land/std/fmt/printf.ts";
export {exists} from "https://deno.land/std/fs/mod.ts";

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export const errVal = (msg?: string): any => {
  throw Error(msg);
};

export const toPrec = (String.prototype as any).toPrec = (val: any, prec: number = 3, round: any = Math.round): number => {
  const type = typeof (val);
  let num: number;
  switch (type) {
	case "number":
	  num = val;
	  break;
	case "string":
	default:
	  num = parseFloat(val.toString());
	  break;
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
  title?: string | undefined,
  action?: (() => any) | undefined,
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
	  const action = entities[choose].action;
	  if (!action) break;
	  const res = action();
	  if (res && res instanceof Promise) await res;
	} else {
	  console.error("wrong input\n");
	}
  }
};