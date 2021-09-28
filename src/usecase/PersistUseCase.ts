import 'dotenv/config'
import { Order } from '../models/order'
import { Price } from '../models/price'
import { append, write } from '../services/persistence.service'
import { Operation } from '../types/operation.type'

const header = 'time,coin,operation,Condicao atendida,spot amount,spot price (limpo),Spot Price (c/ corretagem),spot fee,custo spot entrada,custo spot fee,future amount,future price (limpo),Future Price (c/ correta),future fee,custo future,custo future fee,Premio s/corretagem,Prem s/corr anual,Premio c/corr,Prem c/corr anual,Financeiro efet,P&L check,P&L /custo spot,N _ days (dias pro vencimento),spot buy amount,spot buy price,spot sel amount,spot sel price,future buy amount,future buy price,future sel amount,future sel price\n'

export async function saveOrder(order: Order, price: Price): Promise<Order> {
  write(header)
  append(format(order, price))
  return order
}

export async function savePrice(order: Order, price: Price, pl1: number, pl2: number): Promise<Order> {
  append(format(order, price, Operation.STOP, pl1, pl2))
  return order
}

function format(order: Order, price: Price, operation = Operation.START, pl1 = 0, pl2 = 0, delimiter = ',') : string {
  return `${order.time.toLocaleString('pt-BT', {hour12: false})}${delimiter}${formatSymbol(operation, price)}${delimiter}${formatOperation(operation)}${delimiter}${order.condition ? '1.00' : '0.00'}${delimiter}${order.spot.selAmount}${delimiter}${order.spot.selPrice}${delimiter}${order.spot.pricePlusFee}${delimiter}${order.spot.fee}${delimiter}${order.spot.cost}${delimiter}${order.spot.costPlusFee}${delimiter}${order.future.buyAmount}${delimiter}${order.future.buyPrice}${delimiter}${order.future.pricePlusFee}${delimiter}${order.future.fee}${delimiter}${order.future.cost}${delimiter}${order.future.costPlusFee}${delimiter}${order.payout}${delimiter}${order.yearPayout}${delimiter}${order.payoutPlusFee}${delimiter}${order.yearPayoutPlusFee}${delimiter}${order.finance}${delimiter}${pl1}${delimiter}${pl2}${delimiter}${order.days}${delimiter}${price.spot.buyAmount}${delimiter}${price.spot.buyPrice}${delimiter}${price.spot.selAmount}${delimiter}${price.spot.selPrice}${delimiter}${price.future.buyAmount}${delimiter}${price.future.buyPrice}${delimiter}${price.future.selAmount}${delimiter}${price.future.selPrice}\n`
}

function formatOperation(op: Operation): string { 
  return (op == Operation.START) ? 'MONTAR' : 'ZERAR'
}

function formatSymbol(op: Operation, price: Price): string { 
  return (op == Operation.START) ? `${price.spot.symbol}|${price.future.symbol}` : price.future.symbol
}