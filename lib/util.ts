// import * as Colors from "https://deno.land/std/fmt/colors.ts";
// import { printf } from "https://deno.land/std/fmt/printf.ts";

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export const print = (...data: unknown[]): void => {
  return console.log(...data);

  // let cen = Colors.getColorEnabled();
  // Colors.setColorEnabled(false);
  // console.log(...data);
  // Colors.setColorEnabled(cen);
  // return;

  data?.forEach((it) => {
    // return printf("%j", it);

    if (
      typeof (data) == "string" ||
      typeof (data) == "number" ||
      typeof (data) == "boolean"
    ) {
      return console.log(it);
    }
    return console.log(JSON.stringify(it, undefined, "\t"));
  });
};
