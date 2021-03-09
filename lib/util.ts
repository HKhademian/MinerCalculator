export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export const print = (...data: unknown[]) : void => {
  data?.forEach(it=> {
    if(typeof(data) == "string" || typeof(data) == "number" || typeof(data) == "boolean") {
      return console.log(it);
    }
    return console.log(JSON.stringify(it, undefined, '\t'));
  });
};
