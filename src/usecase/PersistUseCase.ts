import 'dotenv/config'
import { Order } from '../models/operation'
import { append, write } from '../services/persistence.service'

const header = 'time,operation,spot amount,spot price,spot fee,future amount,future price,future fee,payout,P&L\n'

export async function saveOrder(order: Order): Promise<Order> {
  write(header)
  append(format(order))
  return order
}

export async function savePrice(order: Order, pl: number): Promise<Order> {
  append(format(order, 'ZERAR', pl))
  return order
}

function format(order: Order, operation = 'MONTAR', pl = 0, delimiter = ',') : string {
  return `${order.time.toISOString()}${delimiter}${operation}${delimiter}${order.spot.buyAmount}${delimiter}${order.spot.buyPrice}${delimiter}${order.spot.fee}${delimiter}${order.future.selAmount}${delimiter}${order.future.selPrice}${delimiter}${order.future.fee}${delimiter}${order.payout}${delimiter}${pl}\n`
}