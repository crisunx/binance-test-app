import { Type } from "../types/coin.type";

export interface Price {
  time: Date
  coinA: Item
  coinB: Item
}

export interface Item {
  symbol: string
  buyPrice: number
  buyAmount: number
  selPrice: number
  selAmount: number
  fee: number,
  type: Type
  lastFundingRate: number
  nextFundingTime: Date |undefined
}
