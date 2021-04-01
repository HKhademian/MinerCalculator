export {};

declare global {
  function alert(message?: any): void;

  function prompt(message?: string, _default?: string): string | null;

  interface Array<T> {
	sumBy(def?: number, trans?: (it: T) => number): number;

	minBy(trans?: (it: T) => number): T | undefined;

	maxBy(trans?: (it: T) => number): T | undefined;
  }
}

Array.prototype.sumBy = function <T>(def: number = 0, trans: (it: T) => number = (it) => (it as any as number)): number {
  return this.reduce((p, it) => p + trans(it), def);
};

Array.prototype.minBy = function <T>(trans: (it: T) => number = (it) => (it as any)): T {
  return this && this.length > 0 && this.reduce((prev: T, it: T) => trans(it) < trans(prev) ? it : prev, this[0]);
}

Array.prototype.maxBy = function <T>(trans: (it: T) => number = (it) => (it as any)): T {
  return this && this.length > 0 && this.reduce((prev, it) => trans(it) > trans(prev) ? it : prev, this[0]);
}
