export {};

declare global {
  function alert(message?: any): void;

  function prompt(message?: string, _default?: string): string | null;

  interface Array<T> {
	sumBy(trans?: (it: T) => number): number;

	minBy(trans?: (it: T) => number): T | undefined;

	maxBy(trans?: (it: T) => number): T | undefined;

	mapAsync<E>(trans: (it: T, index: number, arr: Array<T>) => Promise<E>): Promise<E[]>;

	mapAwait<E>(trans: (it: T, index: number, arr: Array<T>) => Promise<E>): Promise<E[]>;

	forEachAsync(trans: (it: T, index: number, arr: Array<T>) => Promise<any>): Promise<void>;

	forEachAwait(trans: (it: T, index: number, arr: Array<T>) => Promise<any>): Promise<void>;
  }
}

Array.prototype.sumBy = function <T>(trans: (it: T) => number = (it) => (it as any as number)): number {
  return this.reduce((p, it) => p + trans(it), 0);
};

Array.prototype.minBy = function <T>(trans: (it: T) => number = (it) => (it as any)): T {
  return this && this.length > 0 && this.reduce((prev: T, it: T) => trans(it) < trans(prev) ? it : prev, this[0]);
}

Array.prototype.maxBy = function <T>(trans: (it: T) => number = (it) => (it as any)): T {
  return this && this.length > 0 && this.reduce((prev, it) => trans(it) > trans(prev) ? it : prev, this[0]);
}


Array.prototype.mapAsync = function <T, E>(trans: (it: T, index: number, arr: Array<T>) => Promise<E>): Promise<E[]> {
  return Promise.all(this.map(trans));
}

Array.prototype.mapAwait = async function <T, E>(trans: (it: T, index: number, arr: Array<T>) => Promise<E>): Promise<E[]> {
  const res = [];
  for (let i = 0; i < this.length; i++) {
	res.push(await trans(this[i], i, this));
  }
  return res;
}

Array.prototype.forEachAsync = function <T>(trans: (it: T, index: number, arr: Array<T>) => Promise<any>) {
  return this.mapAsync(trans) as any as Promise<void>;
}


Array.prototype.forEachAwait = function <T>(trans: (it: T, index: number, arr: Array<T>) => Promise<any>) {
  return this.mapAwait(trans) as any as Promise<void>;
}

