export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export type Partial<T> = {
  [P in keyof T]?: T[P];
};
