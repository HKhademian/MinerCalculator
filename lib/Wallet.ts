import { DeepPartial } from './index.ts';

export interface Wallet {
  id: string;
  coin: string;
  holder: string;
  value: number;
  desc: string;
}

export const newWallet = (source?: DeepPartial<Wallet>) =>
  ({
    id: source?.id || 'unknown',
    coin: source?.coin || 'unknown',
    holder: source?.holder || 'unknown',
    value: source?.value || 0.0,
    desc: source?.desc || '',
  }) as Wallet;
