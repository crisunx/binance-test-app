import 'dotenv/config'
import { Order } from '../models/operation'
import { depth, futureDepth } from '../services/exchange.service'
import { Fee } from '../types/fee.type'
import { OrderBook } from '../types/orderbook.type'

const coinSpot = process.env.SPOT || ''
const coinFuture = process.env.FUTURE || ''
const finishDate = process.env.FUTURE_FINISH_DATE || ''
const days = Math.floor((Date.parse(finishDate) - Date.now()) / 86400000)

export async function makeOrder(spotFee: Fee, futureFee: Fee): Promise<Order> {
  const spot = await depth(coinSpot).then((res) => res.data)
  const future = await futureDepth(coinFuture).then((res) => res.data)
  return execute(spot, spotFee, future, futureFee)
}

function execute(spot: OrderBook, spotFee: Fee, future: OrderBook, futureFee: Fee): Order {
  const spotBuyPrice = spot.bids[0][0]
  const spotBuyAmount = spot.bids[0][1]
  const spotSelPrice = spot.asks[0][0] * (1 + spotFee.takerCommission)
  const spotSelAmount = spot.asks[0][1]
  const spotFinance = spotSelPrice * spotSelAmount

  const futureBuyPrice = future.bids[0][0]
  const futureBuyAmount = future.bids[0][1] * (1 - futureFee.takerCommission)
  const futureSelPrice = future.asks[0][0]
  const futureSelAmount = future.asks[0][1]
  const futureFinance = futureBuyPrice * futureBuyAmount

  const payout = (futureBuyPrice / spotSelPrice - 1) * 100
  const yearPayout = (Math.pow(1 + payout / 100, 365 / days) - 1) * 100

  return {
    time: new Date(),
    payout: payout,
    yearPayout: yearPayout,
    spot: {
      finance: spotFinance,
      buyPrice: spotBuyPrice,
      selPrice: spotSelPrice,
      buyAmount: spotBuyAmount,
      selAmount: spotSelAmount,
      fee: spotFee.takerCommission,
    },
    future: {
      finance: futureFinance,
      buyPrice: futureBuyPrice,
      selPrice: futureSelPrice,
      buyAmount: futureBuyAmount,
      selAmount: futureSelAmount,
      fee: futureFee.takerCommission,
    },
  }
}
