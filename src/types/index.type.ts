export interface PremiumIndex {
  symbol: string
  pair: string
  markPrice: number
  indexPrice: number
  estimatedSettlePrice: number
  lastFundingRate: number
  interestRate: number
  nextFundingTime: number
  time: number
}
