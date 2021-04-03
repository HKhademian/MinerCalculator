import {System} from './System.ts';
import {User} from "./User.ts";
import {BTC, Coin} from "./Coin.ts";
import {Source} from "./Source.ts";
import {DeepPartial, errVal, generateID} from '../util.ts';

export namespace Wallet {
  type WalletType = 'live' | 'working' | 'saving';

  export type WalletData = {
	id: string;
	coin: string | Coin;
	source: string | Source;
	user?: string | User;
	type: WalletType,
	lastUpdate: number;
	value: number;
	desc?: string;
  };

  export interface Wallet extends WalletData {
	coin: string;
	source: string;
	user?: string;
  }

  export const findAll = async (
	cond: { wallet?: Wallet | string, source?: Source | string, coin?: Coin | string, user?: User | string, type?: WalletType },
	system: System,
  ): Promise<Wallet[]> => {
	let wallets: Wallet[] = system?.wallets || [];
	if (cond.wallet) {
	  let wallet = (typeof (cond.wallet) != "string") ? cond.wallet as Wallet : wallets.find(it => it.id == cond.wallet);
	  if (wallet) return [wallet];
	  return [];
	}
	if (cond.source) {
	  const sourceId = typeof (cond.source) == "string" ? cond.source : cond.source.id;
	  wallets = wallets.filter(it => it.source == sourceId);
	}
	if (cond.coin) {
	  const coinId = typeof (cond.coin) == "string" ? cond.coin : cond.coin.id;
	  wallets = wallets.filter(it => it.coin == coinId);
	}
	if (cond.user) {
	  const userId = typeof (cond.user) == "string" ? cond.user : cond.user.id;
	  wallets = wallets.filter(it => it.user == userId);
	}
	if (cond.type) {
	  wallets = wallets.filter(it => it.type == cond.type);
	}
	return wallets;
  }

  export const find = async (
	cond: { wallet?: Wallet | string, source?: Source | string, coin?: Coin | string, user?: User | string, type?: WalletType },
	system: System,
	force: boolean = true,
  ): Promise<Wallet | undefined> => {
	const wallets = await findAll(cond, system);
	if (wallets.length > 1) return errVal("more than one wallet found");
	if (wallets.length == 1) return wallets[0];
	if (!force) return undefined;

	return await create({
	  source: cond.source,
	  coin: cond.coin,
	  user: cond.user,
	  type: cond.type,
	  value: 0.0,
	}, undefined, system);
  }

  export const create = async (data?: DeepPartial<WalletData>, base?: Wallet, system?: System): Promise<Wallet> => {
	const coin = data?.coin || base?.coin || errVal("no coin provided");
	const source = data?.source || base?.source || errVal("no source provided");
	const user = data?.user || base?.user;
	const wallet = ({
	  id: data?.id || base?.id || generateID(),
	  coin: typeof coin == "string" ? coin : coin.id,
	  source: typeof source == "string" ? source : source.id,
	  user: typeof user == "string" ? user : user?.id,
	  type: data?.type || base?.type || errVal("no type provided"),
	  lastUpdate: data?.lastUpdate || base?.lastUpdate || 0,
	  value: data?.value || base?.value || 0.0,
	  desc: data?.desc || base?.desc,
	}) as Wallet;
	system?.wallets.push(wallet);
	return wallet;
  }
}

export type Wallet = Wallet.Wallet;
