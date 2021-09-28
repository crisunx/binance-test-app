export interface Order {
  time: Date
  days: number
  spot: Item
  future: Item
  payout: number
  finance: number
  condition: boolean
  yearPayout: number
  payoutPlusFee: number
  yearPayoutPlusFee: number
}

export interface Item {
    buyPrice: number
    buyAmount: number
    pricePlusFee: number
    cost: number
    costPlusFee: number
    selPrice: number
    selAmount: number
    fee: number
}
