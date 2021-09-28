import 'dotenv/config'
import { Order } from '../models/order'
import { Fee } from '../types/fee.type'
import { Operation } from '../types/operation.type'
import { calculateOrder } from './OrderUseCase'
import { savePrice } from './PersistUseCase'
import { takePrice } from './PriceUseCase'

export async function startMonitoring(coinSpot: string, coinFuture:string, order: Order, spotFee: Fee, futureFee: Fee, days: number): Promise<void> {
  const price = await takePrice(coinSpot, coinFuture, spotFee, futureFee)
  const currentOrder = calculateOrder(price, days, Operation.STOP)
  const pnlCheck = currentOrder.effectiveFinance + order.effectiveFinance
  const pnlDivSpotFinance = -pnlCheck / order.spot.finance

  console.log(`Take price to spot ${coinSpot} and future ${coinFuture}`)

  savePrice(currentOrder, price, pnlCheck, pnlDivSpotFinance)
}
