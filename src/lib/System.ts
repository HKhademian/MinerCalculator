import {User} from "./User.ts";
import {Product} from "./Product.ts";
import {Worker} from "./Worker.ts";
import {Company, Source} from "./Source.ts";
import {Wallet} from "./Wallet.ts";
import {BTC, Coin, DASH, DOGE, ETH, LTC, M_IRT, USD} from "./Coin.ts";
import {DeepPartial, errVal} from "../util.ts";

export namespace ShareSetting {
  export type ShareSettingData = {
	user: string | User;
	share: number;
  };

  export interface ShareSetting extends ShareSettingData {
	user: string;
	share: number;
  }

  export const create = (
	source?: DeepPartial<ShareSettingData>,
	base?: ShareSetting,
  ): ShareSetting | undefined => {
	if (!source && !base) return undefined;
	const user = source?.user || base?.user || errVal("no user provided");
	return ({
	  user: typeof user == "string" ? user : user.id,
	  share: source?.share || base?.share || 0.0,
	}) as ShareSetting;
  };

  export const createList = (
	source?: DeepPartial<ShareSettingData> | DeepPartial<ShareSettingData[]>,
	base?: ShareSetting | ShareSetting[],
  ): ShareSetting[] => {
	if (source) {
	  return (source instanceof Array ? source : [source]).map(it => create(it, undefined)!);
	}
	if (base) {
	  (base instanceof Array ? base : [base]).map(it => create(undefined, it)!);
	}
	return [];
  }

  export const NO_SHARE = create({
	user: 'no-user',
	share: 0.0,
  })!!;
}
export type ShareSetting = ShareSetting.ShareSetting;
export type ShareSettingData = ShareSetting.ShareSettingData;
export const NO_SHARE = ShareSetting.NO_SHARE;

export namespace System {
  export const set = (system: System) => (globalThis as any).system = system;
  export const get = (): System => (globalThis as any).system;

  export type SystemData = {
	coins: Coin[];

	companies: Company[];
	products: Product[];
	sources: Source[];

	users: User[];
	wallets: Wallet[];
	workers: Worker[];

	startDate: string;
	currentTime: number;

	managerShare?: ShareSettingData;
	charityShare?: ShareSettingData;
  };

  export interface System extends SystemData {
	managerShare?: ShareSetting;
	charityShare?: ShareSetting;
  }

  export const create = (from?: DeepPartial<SystemData>, base?: System): System => ({
	coins: from?.coins || base?.coins || Coin.BASE_COINS,
	companies: from?.companies || base?.companies || [],
	products: from?.products || base?.products || [],
	sources: from?.sources || base?.sources || [],
	users: from?.users || base?.users || [],
	wallets: from?.wallets || base?.wallets || [],
	workers: from?.workers || base?.workers || [],
	startDate: from?.startDate || base?.startDate || new Date().toDateString(),
	currentTime: from?.currentTime || base?.currentTime || 0,
	managerShare: ShareSetting.create(from?.managerShare, base?.managerShare) || NO_SHARE,
	charityShare: ShareSetting.create(from?.charityShare, base?.charityShare) || NO_SHARE,
  }) as System;

  export const save = async (system: System, path: string = "./data/system.json") => {
	const jsonData = JSON.stringify(system, undefined, 2);
	await Deno.writeTextFile(path, jsonData);
  };

  System.set(System.create());
}

export type System = System.System;
