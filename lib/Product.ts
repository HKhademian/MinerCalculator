import { DeepPartial } from './index.ts';

export interface Product {
  company: string;
  life: number;
  price: number;
  power: number;
  efficiency: number;
}

export const newProduct = (source?: DeepPartial<Product>) =>
  ({
    company: source?.company || 'unknown',
    life: source?.life || 0,
    price: source?.price || -1,
    power: source?.power || 0,
    efficiency: source?.efficiency || 1.0,
  }) as Product;
