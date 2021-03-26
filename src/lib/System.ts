import {User} from "./User.ts";
import {Product} from "./Product.ts";
import {Worker} from "./Worker.ts";
import {Company, Source} from "./Source.ts";
import {Wallet} from "./Wallet.ts";
import {Coin, USD, M_IRT, BTC, ETH, LTC, DOGE, DASH} from "./Coin.ts";
import {DeepPartial, errVal} from "../util.ts";

export interface ShareSetting {
  userId: string;
  share: number;
}

export const newShareSetting = (
  source?: DeepPartial<ShareSetting>,
  base?: ShareSetting,
): ShareSetting | undefined => (source || base) && ({
  userId: source?.userId || base?.userId || errVal("no user-id provided"),
  share: source?.share || base?.share || 0.0,
}) as ShareSetting;

export const newShareListSetting = (
  source?: DeepPartial<ShareSetting> | DeepPartial<ShareSetting[]>,
  base?: ShareSetting | ShareSetting[],
): ShareSetting[] => {
  let items: ShareSetting[] = source as any || base as any || [];
  if (!(items instanceof Array)) {
	items = [items];
  }
  return JSON.parse(JSON.stringify(items));
}

export const NO_SHARE = newShareSetting({
  userId: 'no-user',
  share: 0.0,
})!!;


export interface System {
  coins: Coin[];

  companies: Company[];
  products: Product[];
  sources: Source[];

  users: User[];
  wallets: Wallet[];
  workers: Worker[];

  startDate: string;
  currentTime: number;

  managerShare?: ShareSetting;
  charityShare?: ShareSetting;
}

export namespace System {
  export const set = (system: System) => (globalThis as any).system = system;
  export const get = (): System => (globalThis as any).system;

  export const create = (from?: DeepPartial<System>, base?: System): System => ({
	coins: from?.coins || base?.coins || [USD, M_IRT, BTC, ETH, LTC, DOGE, DASH],
	companies: from?.companies || base?.companies || [],
	products: from?.products || base?.products || [],
	sources: from?.sources || base?.sources || [],
	users: from?.users || base?.users || [],
	wallets: from?.wallets || base?.wallets || [],
	workers: from?.workers || base?.workers || [],
	startDate: from?.startDate || base?.startDate || new Date().toDateString(),
	currentTime: from?.currentTime || base?.currentTime || 0,
	managerShare: newShareSetting(from?.managerShare, base?.managerShare) || NO_SHARE,
	charityShare: newShareSetting(from?.charityShare, base?.charityShare) || NO_SHARE,
  }) as System;

  System.set(System.create());
}
