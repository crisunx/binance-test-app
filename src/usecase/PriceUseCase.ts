import 'dotenv/config'
import { Price } from '../models/price'
import { futureDepth, spotDepth } from '../services/exchange.service'
import { serverTime } from '../services/time.service'
import { Fee } from '../types/fee.type'

export async function takePrice(coinSpot: string, coinFuture: string, spotFee: Fee, futureFee: Fee): Promise<Price> {
  const time = await serverTime().then((res) => res.data)
  const spot = await spotDepth(coinSpot).then((res) => res.data)
  const future = await futureDepth(coinFuture).then((res) => res.data)

  const spotBuyPrice = spot.bids[0][0]
  const spotBuyAmount = spot.bids[0][1]
  const spotSelPrice = spot.asks[0][0]
  const spotSelAmount = spot.asks[0][1]

  const futureBuyPrice = future.bids[0][0]
  const futureBuyAmount = future.bids[0][1]
  const futureSelPrice = future.asks[0][0]
  const futureSelAmount = future.asks[0][1]

  return {
    time: new Date(time.serverTime * 1000),
    spot: {
      symbol: coinSpot,
      buyPrice: spotBuyPrice,
      buyAmount: spotBuyAmount,
      selPrice: spotSelPrice,
      selAmount: spotSelAmount,
      fee: spotFee.takerCommission,
    },
    future: {
      symbol: coinFuture,
      buyPrice: futureBuyPrice,
      buyAmount: futureBuyAmount,
      selPrice: futureSelPrice,
      selAmount: futureSelAmount,
      fee: futureFee.takerCommission,
    },
  }
}
