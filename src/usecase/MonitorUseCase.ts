import 'dotenv/config'
import { Order } from '../models/order'
import { Price } from '../models/price'
import { Coin } from '../types/coin.type'
import { Fee } from '../types/fee.type'
import { Operation } from '../types/operation.type'
import { calculateOrder } from './OrderUseCase'
import { savePrice } from './PersistUseCase'
import { takePrice } from './PriceUseCase'

interface Calc {
  pnlCheck: number,
  currentOrder: Order,
  pnlDivSpotFinance: number
}

export async function startMonitoring(coinA: Coin, coinB: Coin, order: Order, coinAFee: Fee, coinBFee: Fee, days: number, time: Date): Promise<void> {
  await takePrice(coinA, coinB, coinAFee, coinBFee, time).then(async (price) => 
    await calculate(price, order, days).then((data) => 
      savePrice(data.currentOrder, price, data.pnlCheck, data.pnlDivSpotFinance)
    )
  )  
}

async function calculate(price: Price, order: Order, days: number): Promise<Calc>  {
  const currentOrder = calculateOrder(price, days, Operation.STOP)
  const pnlCheck = currentOrder.effectiveFinance + order.effectiveFinance
  const pnlDivSpotFinance = -pnlCheck / order.coinA.finance

  console.log(`Take price ${price.coinA.symbol}|${price.coinB.symbol} payout: ${currentOrder.payout}`)

  return {
    pnlCheck: pnlCheck,
    currentOrder: currentOrder,
    pnlDivSpotFinance: pnlDivSpotFinance
  }
}