export interface Price {
  time: Date
  spot: Item
  future: Item
}

export interface Item {
  symbol: string
  buyPrice: number
  buyAmount: number
  selPrice: number
  selAmount: number
  fee: number
}
