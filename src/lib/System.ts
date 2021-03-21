import {DeepPartial, errVal} from "../util.ts";
import {Coin} from "./Coin.ts";
import {User} from "./User.ts";
import {Product} from "./Product.ts";
import {Worker} from "./Worker.ts";
import {Company, Source} from "./Source.ts";
import {Wallet} from "./Wallet.ts";

export interface ShareSetting {
  userId: string;
  share: number;
}

export interface System {
  companies: Company[];
  products: Product[];
  sources: Source[];

  coins: Coin[];

  users: User[];
  wallets: Wallet[];

  workers: Worker[];

  startDate: string;
  currentTime: number;

  managerShare?: ShareSetting | undefined;
  charityShare?: ShareSetting | undefined;
}

export const newShareSetting = (
  source?: DeepPartial<ShareSetting>,
  base?: ShareSetting | undefined,
): ShareSetting | undefined => (source || base) && ({
  userId: source?.userId || base?.userId || errVal("no user-id provided"),
  share: source?.share || base?.share || 0.0,
}) as ShareSetting;

export const newShareListSetting = (
  source?: DeepPartial<ShareSetting> | DeepPartial<ShareSetting[]>,
  base?: ShareSetting | ShareSetting[] | undefined,
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
