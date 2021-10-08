import 'dotenv/config'
import { Order } from '../models/order'
import { Price } from '../models/price'
import { Type } from '../types/coin.type'
import { Operation } from '../types/operation.type'
import { saveOrder } from './PersistUseCase'

const orderAmount = +(process.env.ORDER_AMOUNT || 0)

export async function makeOrder(price: Price, days: number): Promise<Order> {
  return saveOrder(calculateOrder(price, days, Operation.START), price)
}

export function calculateOrder(price: Price, days: number, op: Operation): Order {
  const support = (op == Operation.START ? 1 : -1)
  const isPerpetual = (price.coinB.type == Type.PERP)
  const coinAAmount = (op == Operation.START ? price.coinA.selAmount : price.coinA.buyAmount)
  const coinAPrice = (op == Operation.START ? price.coinA.selPrice : price.coinA.buyPrice)
  const coinBAmount = (op == Operation.START ? price.coinB.buyAmount : price.coinB.selAmount)
  const coinBPrice = (op == Operation.START ? price.coinB.buyPrice : price.coinB.selPrice)

  const coinAPricePlusFee = coinAPrice * (op == Operation.START ? 1 + price.coinA.fee : 1 - price.coinA.fee)
  const coinAFinance = -orderAmount * coinAPrice * support
  const coinAFinanceMinusOne = orderAmount * (op == Operation.START ? price.coinA.buyPrice : -price.coinA.selPrice)
  const coinAFinancePlusFee = -Math.abs(price.coinA.fee * coinAFinance)

  const coinBPricePlusFee = coinBPrice * (op == Operation.START ? 1 - price.coinB.fee : 1 + price.coinB.fee)
  const coinBFinance = support * orderAmount * coinBPrice
  const coinBFinanceMinusOne = orderAmount * (op == Operation.START ? -price.coinB.selPrice : price.coinB.buyPrice)
  const coinBFinancePlusFee = -Math.abs(price.coinB.fee * coinBFinance)

  const payout = (isPerpetual ? ((coinBPrice / coinAPrice) - 1)  + Number(price.coinB.lastFundingRate) : ((coinBPrice / coinAPrice) - 1))
  const yearPayout = (isPerpetual ? ((payout + (Math.pow(price.coinB.lastFundingRate, (365 * 3))) - 1)) : (Math.pow(1 + payout, 365 / days) - 1))
  const payoutPlusFee = ((coinBPricePlusFee / coinAPricePlusFee) - 1) + Number(isPerpetual ? price.coinB.lastFundingRate : 0)
  const yearPayoutPlusFee = (isPerpetual ? ( (payoutPlusFee + (Math.pow(price.coinB.lastFundingRate, (365 * 3))) - 1) ) : (Math.pow(1 + payoutPlusFee, 365 / days) - 1))

  const effectiveFinance = coinAFinance + coinAFinancePlusFee + coinBFinance + coinBFinancePlusFee
  const condition = Math.min(coinBAmount, coinAAmount) > orderAmount

  return {
    time: price.time,
    days: days,
    payout: payout,
    effectiveFinance: effectiveFinance,
    condition: condition,
    yearPayout: yearPayout,
    payoutPlusFee: payoutPlusFee,
    yearPayoutPlusFee: yearPayoutPlusFee,
    coinA: {
      price: coinAPrice,
      amount: coinAAmount,
      buyPrice: price.coinA.buyPrice,
      buyAmount: price.coinA.buyAmount,
      pricePlusFee: coinAPricePlusFee,
      finance: coinAFinance,
      financeMinusOne: coinAFinanceMinusOne,
      financePlusFee: coinAFinancePlusFee,
      selPrice: price.coinA.selPrice,
      selAmount: price.coinA.selAmount,
      fee: price.coinA.fee
    },
    coinB: {
      price: coinBPrice,
      amount: coinBAmount,
      buyPrice: price.coinB.buyPrice,
      buyAmount: price.coinB.buyAmount,
      pricePlusFee: coinBPricePlusFee,
      finance: coinBFinance,
      financeMinusOne: coinBFinanceMinusOne,
      financePlusFee: coinBFinancePlusFee,
      selPrice: price.coinB.selPrice,
      selAmount: price.coinB.selAmount,
      fee: price.coinB.fee
    },
  }
}

function calcPayout(coinBPrice: number, coinAPrice: number): number {
  return (coinBPrice / coinAPrice) - 1
}