import 'dotenv/config'
import { Order } from '../models/order'
import { Price } from '../models/price'
import { append, write } from '../services/persistence.service'
import { Operation } from '../types/operation.type'

const header = 'time (UTC),Coin,operation,Condicao atendida,spot amount,spot price (limpo),Spot Price (c/ corretagem),spot fee,Financeiro Spot (OLD: custo spot entrada),custo spot fee (Code: spotFinancePlusFee),future amount,future price (limpo),Future Price (c/ correta),future fee,Financeiro Futuro (OLD: custo future),custo future fee,Premio s/corretagem (Code: payout),Prem s/corr anual (Code: yearPayout),Premio c/corr (Code: PayoutPlusFee),Prem c/corr anual (Code: YearPayoutPlusFee),Financeiro efet (Code: effectiveFinance),P&L check (Code: pnlCheck),P&L / custo spot (Code: pnlDivSpotFinance),N _ days (dias pro vencimento),spot buy amount,spot buy price,spot sel amount,spot sel price,future buy amount,future buy price,future sel amount,future sel price\n'

export async function saveOrder(order: Order, price: Price): Promise<Order> {
  write(header)
  append(format(order, price))
  return order
}

export async function savePrice(order: Order, price: Price, pnlCheck: number, pnlDivSpotFinance: number): Promise<Order> {
  append(format(order, price, Operation.STOP, pnlCheck, pnlDivSpotFinance))
  return order
}

function format(order: Order, price: Price, operation = Operation.START, pnlCheck = 0, pnlDivSpotFinance = 0, delimiter = ',') : string {
/*   return `${order.time.toLocaleString('pt-BT', {hour12: false})}${delimiter}
  ${formatSymbol(operation, price)}${delimiter}
  ${formatOperation(operation)}${delimiter}
  ${order.condition ? '1' : '0'}${delimiter}
  ${order.spot.amount}${delimiter}
  ${order.spot.price}${delimiter}
  ${order.spot.pricePlusFee}${delimiter}
  ${order.spot.fee}${delimiter}
  ${order.spot.finance}${delimiter}
  ${order.spot.financePlusFee}${delimiter}
  ${order.future.amount}${delimiter}
  ${order.future.price}${delimiter}
  ${order.future.pricePlusFee}${delimiter}
  ${order.future.fee}${delimiter}
  ${order.future.finance}${delimiter}
  ${order.future.financePlusFee}${delimiter}
  ${order.payout}${delimiter}
  ${order.yearPayout}${delimiter}
  ${order.payoutPlusFee}${delimiter}
  ${order.yearPayoutPlusFee}${delimiter}
  ${order.effectiveFinance}${delimiter}
  ${pnlCheck}${delimiter}
  ${pnlDivSpotFinance}${delimiter}
  ${order.days}${delimiter}
  ${price.spot.buyAmount}${delimiter}
  ${price.spot.buyPrice}${delimiter}
  ${price.spot.selAmount}${delimiter}
  ${price.spot.selPrice}${delimiter}
  ${price.future.buyAmount}${delimiter}
  ${price.future.buyPrice}${delimiter}
  ${price.future.selAmount}${delimiter}
  ${price.future.selPrice}\n`
 */
  return `${order.time.toLocaleString('pt-BT', {hour12: false})}${delimiter}${formatSymbol(operation, price)}${delimiter}${formatOperation(operation)}${delimiter}${order.condition ? '1' : '0'}${delimiter}${order.spot.amount}${delimiter}${order.spot.price}${delimiter}${order.spot.pricePlusFee}${delimiter}${order.spot.fee}${delimiter}${order.spot.finance}${delimiter}${order.spot.financePlusFee}${delimiter}${order.future.amount}${delimiter}${order.future.price}${delimiter}${order.future.pricePlusFee}${delimiter}${order.future.fee}${delimiter}${order.future.finance}${delimiter}${order.future.financePlusFee}${delimiter}${order.payout}${delimiter}${order.yearPayout}${delimiter}${order.payoutPlusFee}${delimiter}${order.yearPayoutPlusFee}${delimiter}${order.effectiveFinance}${delimiter}${pnlCheck}${delimiter}${pnlDivSpotFinance}${delimiter}${order.days}${delimiter}${price.spot.buyAmount}${delimiter}${price.spot.buyPrice}${delimiter}${price.spot.selAmount}${delimiter}${price.spot.selPrice}${delimiter}${price.future.buyAmount}${delimiter}${price.future.buyPrice}${delimiter}${price.future.selAmount}${delimiter}${price.future.selPrice}\n`
}

function formatOperation(op: Operation): string { 
  return (op == Operation.START) ? 'MONTAR' : 'ZERAR'
}

function formatSymbol(op: Operation, price: Price): string { 
  return (op == Operation.START) ? `${price.spot.symbol}|${price.future.symbol}` : price.future.symbol
}