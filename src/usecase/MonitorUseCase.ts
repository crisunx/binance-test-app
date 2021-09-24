import 'dotenv/config'
import { Order } from '../models/operation'
import { Fee } from '../types/fee.type'
import { makeOrder } from './OrderUseCase'
import { savePrice } from './PersistUseCase'

export async function startMonitoring(order: Order, spotFee: Fee, futureFee: Fee): Promise<void> {
  const price = await makeOrder(spotFee, futureFee)
  const pl = order.payout - price.payout

  console.log(`Price: ${price.time.toISOString()} P&L: ${pl}`)

  savePrice(price, pl)
}
