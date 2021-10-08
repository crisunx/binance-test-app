export interface CoinOperation {
  coinA: Coin
  coinB: Coin
}

export interface Coin {
  symbol: string
  date: string
  type: Type
}

export enum Type {
  SPOT = 'SPOT',
  PERP = 'PERP',
  FUTURE = 'FUTURE',
}
