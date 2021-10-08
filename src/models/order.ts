export interface Order {
  time: Date
  days: number
  coinA: Item
  coinB: Item
  payout: number
  effectiveFinance: number
  condition: boolean
  yearPayout: number
  payoutPlusFee: number
  yearPayoutPlusFee: number
}

export interface Item {
    price: number
    amount: number
    buyPrice: number
    buyAmount: number
    pricePlusFee: number
    finance: number
    financeMinusOne: number
    financePlusFee: number
    selPrice: number
    selAmount: number
    fee: number
}
