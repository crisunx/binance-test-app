export interface Order {
  time: Date
  spot: Spot
  future: Future,
  payout: number,
  yearPayout: number,
}

export interface Spot {
    buyPrice: number
    buyAmount: number
    selPrice: number
    selAmount: number
    finance: number,
    fee: number
}

export interface Future {
    buyPrice: number
    buyAmount: number
    selPrice: number
    selAmount: number
    finance: number
    fee: number
}