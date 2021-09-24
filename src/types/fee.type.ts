export interface Fees {
  data: Fee[]
}

export interface Fee {
  level: number
  bnbFloor: number
  bnbCeil: number
  btcFloor: number
  btcCeil: number
  makerCommission: number
  takerCommission: number
  buyerCommission: number
  sellerCommission: number
}
