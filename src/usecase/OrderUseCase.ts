import 'dotenv/config'
import { Order } from '../models/order'
import { Price } from '../models/price'
import { Operation } from '../types/operation.type'
import { saveOrder } from './PersistUseCase'

const orderAmount = +(process.env.ORDER_AMOUNT || 0)

export async function makeOrder(price: Price, days: number): Promise<Order> {
  return saveOrder(calculateOrder(price, days, Operation.START), price)
}

export function calculateOrder(price: Price, days: number, op: Operation): Order {
  const support = (op == Operation.START ? 1 : -1)
  const spotAmount = (op == Operation.START ? price.spot.selAmount : price.spot.buyAmount)
  const spotPrice = (op == Operation.START ? price.spot.selPrice : price.spot.buyPrice)
  const futureAmount = (op == Operation.START ? price.future.buyAmount : price.future.selAmount)
  const futurePrice = (op == Operation.START ? price.future.buyPrice : price.future.selPrice)

  const spotPricePlusFee = spotPrice * (op == Operation.START ? 1 + price.spot.fee : 1 - price.spot.fee)
  const spotFinance = -orderAmount * spotPrice * support
  const spotFinancePlusFee = -Math.abs(price.spot.fee * spotFinance)

  const futurePricePlusFee = futurePrice * (op == Operation.START ? 1 - price.future.fee : 1 + price.future.fee)
  const futureFinance = support * orderAmount * futurePrice
  const futureFinancePlusFee = -Math.abs(price.future.fee * futureFinance)

  const payout = (futurePrice / spotPrice) - 1
  const yearPayout = Math.pow(1 + payout, 365 / days) - 1
  const payoutPlusFee = (futurePricePlusFee / spotPricePlusFee) - 1
  const yearPayoutPlusFee = Math.pow(1 + payoutPlusFee, 365 / days) - 1
  
  const effectiveFinance = spotFinance + spotFinancePlusFee + futureFinance + futureFinancePlusFee
  const condition = Math.min(futureAmount, spotAmount) > orderAmount

  return {
    time: new Date(),
    days: days,
    payout: payout,
    effectiveFinance: effectiveFinance,
    condition: condition,
    yearPayout: yearPayout,
    payoutPlusFee: payoutPlusFee,
    yearPayoutPlusFee: yearPayoutPlusFee,
    spot: {
      price: spotPrice,
      amount: spotAmount,
      buyPrice: price.spot.buyPrice,
      buyAmount: price.spot.buyAmount,
      pricePlusFee: spotPricePlusFee,
      finance: spotFinance,
      financePlusFee: spotFinancePlusFee,
      selPrice: price.spot.selPrice,
      selAmount: price.spot.selAmount,
      fee: price.spot.fee
    },
    future: {
      price: futurePrice,
      amount: futureAmount,
      buyPrice: price.future.buyPrice,
      buyAmount: price.future.buyAmount,
      pricePlusFee: futurePricePlusFee,
      finance: futureFinance,
      financePlusFee: futureFinancePlusFee,
      selPrice: price.future.selPrice,
      selAmount: price.future.selAmount,
      fee: price.future.fee
    },
  }
}
