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
  if (op == Operation.START) {
    return startOrder(price, days, op)
  } else {
    return stopOrder(price, days, op)
  }
}

export function startOrder(price: Price, days: number, op: Operation): Order {
  const spotSelPricePlusFee = price.spot.selPrice * (op == Operation.START ? 1 + price.spot.fee : 1 - price.spot.fee)
  const spotSelCost = -orderAmount * price.spot.selPrice * (op == Operation.START ? 1 : -1)
  const spotSelCostPlusFee = -Math.abs(price.spot.fee * spotSelCost)

  const futureBuyPricePlusFee = price.future.buyPrice * (op == Operation.START ? 1 - price.future.fee : 1 + price.future.fee)
  const futureBuyCost = orderAmount * price.future.buyPrice * (op == Operation.START ? 1 : -1)
  const futureBuyCostPlusFee = -Math.abs(price.future.fee * futureBuyCost)

  const payout = (price.future.buyPrice / price.spot.selPrice) - 1
  const yearPayout = Math.pow(1 + payout, 365 / days) - 1
  const payoutPlusFee = (futureBuyPricePlusFee / spotSelPricePlusFee) - 1
  const yearPayoutPlusFee = Math.pow(1 + payoutPlusFee, 365 / days) - 1
  
  const finance = spotSelCost + spotSelCostPlusFee + futureBuyCost + futureBuyCostPlusFee
  const condition = Math.min(price.future.buyAmount, price.spot.selAmount) > orderAmount

  return {
    time: new Date(),
    days: days,
    payout: payout,
    finance: finance,
    condition: condition,
    yearPayout: yearPayout,
    payoutPlusFee: payoutPlusFee,
    yearPayoutPlusFee: yearPayoutPlusFee,
    spot: {
      buyPrice: price.spot.buyPrice,
      buyAmount: price.spot.buyAmount,
      pricePlusFee: spotSelPricePlusFee,
      cost: spotSelCost,
      costPlusFee: spotSelCostPlusFee,
      selPrice: price.spot.selPrice,
      selAmount: price.spot.selAmount,
      fee: price.spot.fee
    },
    future: {
      buyPrice: price.future.buyPrice,
      buyAmount: price.future.buyAmount,
      pricePlusFee: futureBuyPricePlusFee,
      cost: futureBuyCost,
      costPlusFee: futureBuyCostPlusFee,
      selPrice: price.future.selPrice,
      selAmount: price.future.selAmount,
      fee: price.future.fee
    },
  }
}

export function stopOrder(price: Price, days: number, op: Operation): Order {
  const spotBuyPricePlusFee = price.spot.buyPrice * (op == Operation.START ? 1 + price.spot.fee : 1 - price.spot.fee)
  const spotBuyCost = -orderAmount * price.spot.buyPrice * (op == Operation.START ? 1 : -1)
  const spotBuyCostPlusFee = -Math.abs(price.spot.fee * spotBuyCost)

  const futureSelPricePlusFee = price.future.selPrice * (op == Operation.START ? 1 - price.future.fee : 1 + price.future.fee)
  const futureSelCost = orderAmount * price.future.selPrice * (op == Operation.START ? 1 : -1)
  const futureSelCostPlusFee = -Math.abs(price.future.fee * futureSelCost)

  const payout = (price.future.selPrice / price.spot.buyPrice) - 1
  const yearPayout = Math.pow(1 + payout, 365 / days) - 1
  const payoutPlusFee = (futureSelPricePlusFee / spotBuyPricePlusFee) - 1
  const yearPayoutPlusFee = Math.pow(1 + payoutPlusFee, 365 / days) - 1
  
  const finance = spotBuyCost + spotBuyCostPlusFee + futureSelCost + futureSelCostPlusFee
  const condition = Math.min(price.future.selAmount, price.spot.buyAmount) > orderAmount

  return {
    time: new Date(),
    days: days,
    payout: payout,
    finance: finance,
    condition: condition,
    yearPayout: yearPayout,
    payoutPlusFee: payoutPlusFee,
    yearPayoutPlusFee: yearPayoutPlusFee,
    spot: {
      buyPrice: price.spot.buyPrice,
      buyAmount: price.spot.buyAmount,
      pricePlusFee: spotBuyPricePlusFee,
      cost: spotBuyCost,
      costPlusFee: spotBuyCostPlusFee,
      selPrice: price.spot.selPrice,
      selAmount: price.spot.selAmount,
      fee: price.spot.fee
    },
    future: {
      buyPrice: price.future.buyPrice,
      buyAmount: price.future.buyAmount,
      pricePlusFee: futureSelPricePlusFee,
      cost: futureSelCost,
      costPlusFee: futureSelCostPlusFee,
      selPrice: price.future.selPrice,
      selAmount: price.future.selAmount,
      fee: price.future.fee
    },
  }
}
