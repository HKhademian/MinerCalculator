import {DeepPartial, errVal} from '../util.ts';
import {System} from './System.ts';
import {User} from "./User.ts";
import {Coin} from "./Coin.ts";
import {Source} from "./Source.ts";

export interface Wallet {
  id: string;
  coinId: string;
  sourceId: string;
  userId?: string;
  walletAddress?: string | undefined;
  type: 'real' | 'virtual';
  value: number;
  desc: string;
}

export const newWallet = (options?: DeepPartial<Wallet>, base?: Wallet | undefined): Wallet => ({
  id: options?.id || base?.id || errVal("no wallet-id specified"),
  coinId: options?.coinId || base?.coinId || errVal("no coin-id specified"),
  sourceId: options?.sourceId || base?.sourceId || errVal("no source-id specified"),
  userId: options?.userId || base?.userId || undefined,
  walletAddress: options?.walletAddress || base?.walletAddress || undefined,
  type: options?.type || base?.type || 'virtual',
  value: options?.value || base?.value || 0.0,
  desc: options?.desc || base?.desc,
}) as Wallet;


/*** get user wallet from specified conditions, if there is no wallet, then create one for it */
export const getUserWallet =
  ({
	 system,
	 source: sourceOrNull, sourceId,
	 coin: coinOrNull, coinId,
	 user: userOrNull, userId,
   }: {
	system: System, user?: User, userId?: string, coin?: Coin, coinId?: string, source?: any, sourceId?: string,
  }): Wallet => {
	const source: Source = sourceOrNull || system.sources.find(it => it.id == sourceId) || errVal(`no source for id ${sourceId} found`);
	const coin: Coin = coinOrNull || system.coins.find(it => it.id == coinId) || errVal(`no coin for id ${coinId} found`);
	const user: User | undefined = userOrNull || system.users.find(it => it.id == userId);

	let wallet = system.wallets.find(it => (it.sourceId == source.id) && (it.coinId == coin.id) && ((!user && !it.userId) || (user && it.userId == user.id)));

	if (!wallet) {
	  wallet = newWallet({
		id: 'xxx',
		sourceId: source.id,
		coinId: coin.id,
		userId: user?.id,
		type: 'virtual',
		value: 0.0,
		desc: 'auto generated',
	  });
	  system.wallets.push(wallet);
	}

	return wallet;
  };
