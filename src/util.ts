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
  title: string,
  action?: (() => Promise<any> | undefined) | undefined,
}[], before?: (() => any), options?: { autoClear?: boolean, defaultChoice?: number }) => {
  if (before) {
	let res = before();
	if (res && res instanceof Promise) await res;
  }
  while (true) {
	if (options?.autoClear) console.clear();
	console.log('\n', header);
	entities.forEach(({title}, index) => console.log(`${index}) ${title}`));
	// @ts-ignore
	const choose = parseInt(prompt("Please enter menu number:", options?.defaultChoice?.toString()));
	if (choose >= 0 && choose < entities.length) {
	  const action = entities[choose].action;
	  if (!action) break;
	  const res = action();
	  if (res) await res;
	} else {
	  console.error("wrong input\n");
	}
  }
};
