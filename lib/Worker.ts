import { DeepPartial, Product } from './index.ts';
  
export interface Worker {
  power: number;
  efficiency: number;
  buy_company: string;
  buy_factorId: string;
  buy_price: number;
  buy_start_day: number;
  buy_end_day: number;
  purchase_owners: { [key: string]: number };
  owners: { [key: string]: number };
}

export const newWorker = (source?: DeepPartial<Worker>): Worker =>
  ({
    power: source?.power || 0,
    efficiency: source?.efficiency || 1.0,
    buy_company: source?.buy_company,
    buy_factorId: source?.buy_factorId,
    buy_price: source?.buy_price || 0,
    buy_start_day: source?.buy_start_day || 0,
    buy_end_day: source?.buy_end_day || 0,
    purchase_owners: source?.purchase_owners &&
      JSON.parse(JSON.stringify(source?.purchase_owners)),
    owners: source?.owners && JSON.parse(JSON.stringify(source?.owners)),
  }) as Worker;

export const newWorkerFromProduct = (
  { product, owners, start_day = 0, count = 0 }: {
    product: Product;
    owners: { [key: string]: number };
    start_day?: number | undefined;
    count?: number | undefined;
  },
) =>
  newWorker({
    owners,
    power: product.power * count,
    efficiency: product.efficiency,
    buy_company: product.company,
    buy_factorId: 'XXXX',
    buy_price: product.price * count,
    buy_start_day: start_day,
    buy_end_day: start_day + product.life,
  });
