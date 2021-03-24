import {DeepPartial, errVal, generateID} from '../util.ts';
import {System} from './System.ts';
import {User} from "./User.ts";
import {Coin} from "./Coin.ts";
import {Source} from "./Source.ts";

type WalletType = 'live' | 'income' | 'working' | 'saving';

export interface Wallet {
  id: string;
  coinId: string;
  sourceId: string;
  userId?: string;
  type: WalletType,
  walletAddress?: string | undefined;
  value: number;
  desc: string;
}

export namespace Wallet {
  export const findAll = (
	cond: { wallet?: Wallet | string, source?: Source | string, coin?: Coin | string, user?: User | string, type?: WalletType },
	system: System,
  ): Wallet[] => {
	let wallets: Wallet[] = system?.wallets || [];
	if (cond.wallet) {
	  let wallet = (typeof (cond.wallet) != "string") ? cond.wallet as Wallet : wallets.find(it => it.id == cond.wallet);
	  if (wallet) return [wallet];
	  return [];
	}
	if (cond.source) {
	  const sourceId = typeof (cond.source) == "string" ? cond.source : cond.source.id;
	  wallets = wallets.filter(it => it.sourceId == sourceId);
	}
	if (cond.coin) {
	  const coinId = typeof (cond.coin) == "string" ? cond.coin : cond.coin.id;
	  wallets = wallets.filter(it => it.coinId == coinId);
	}
	if (cond.user) {
	  const userId = typeof (cond.user) == "string" ? cond.user : cond.user.id;
	  wallets = wallets.filter(it => it.userId == userId);
	}
	if (cond.type) {
	  wallets = wallets.filter(it => it.type == cond.type);
	}

	return wallets;
  }

  export const find = (
	cond: { wallet?: Wallet | string, source?: Source | string, coin?: Coin | string, user?: User | string, type?: WalletType },
	system: System,
	force: boolean = true,
  ): Wallet | undefined => {
	const wallets = findAll(cond, system);
	if (wallets.length > 1) return errVal("more than one wallet found");
	if (wallets.length == 1) return wallets[0];
	if (!force) return undefined;

	return newWallet({
	  sourceId: cond.source ? typeof (cond.source) == "string" ? cond.source : cond.source.id : errVal("no source provided"),
	  coinId: cond.coin ? typeof (cond.coin) == "string" ? cond.coin : cond.coin.id : errVal("no coin provided"),
	  userId: cond.user ? typeof (cond.user) == "string" ? cond.user : cond.user.id : undefined,
	  type: cond.type || 'live',
	  value: 0.0,
	}, undefined, system);
  }

  export const newWallet = (options?: DeepPartial<Wallet>, base?: Wallet | undefined, system?: System): Wallet => {
	let wallet = ({
	  id: options?.id || base?.id || generateID(),
	  coinId: options?.coinId || base?.coinId || errVal("no coin-id specified"),
	  sourceId: options?.sourceId || base?.sourceId || errVal("no source-id specified"),
	  userId: options?.userId || base?.userId || undefined,
	  walletAddress: options?.walletAddress || base?.walletAddress || undefined,
	  type: options?.type || base?.type || 'virtual',
	  value: options?.value || base?.value || 0.0,
	  desc: options?.desc || base?.desc,
	}) as Wallet;
	system?.wallets?.push(wallet);
	return wallet;
  }
}
