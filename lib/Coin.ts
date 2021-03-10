import { DeepPartial } from "./util.ts";

export interface Coin {
  id: string;
  title: string;
  sign: string;
  value: number;
  desc: string;
}

export const newCoin = (source?: DeepPartial<Coin>) =>
  ({
    id: source?.id || "unknown",
    title: source?.title || "Unknown",
    sign: source?.sign || "Unknown",
    value: source?.value || 0.0,
    desc: source?.desc || "",
  }) as Coin;
