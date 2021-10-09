import 'dotenv/config'
import { Order } from '../models/order'
import { Price } from '../models/price'
import { append, write } from '../services/persistence.service'
import { Operation } from '../types/operation.type'

const delimiter = '\t'
const header = `time (UTC)${delimiter}Par de moedas${delimiter}Moeda Base${delimiter}Moeda Contra${delimiter}operation${delimiter}Condicao atendida${delimiter}Moeda Base amount${delimiter}Moeda Base price (limpo)${delimiter}Moeda Base Price (c/ corretagem)${delimiter}Moeda Base fee${delimiter}Financeiro Moeda Base (OLD: custo spot entrada)${delimiter}Financeiro Moeda Base-1${delimiter}custo Moeda Base fee (Code: spotFinancePlusFee)${delimiter}Moeda Contra amount${delimiter}Moeda Contra price (limpo)${delimiter}Moeda Contra Price (c/ correta)${delimiter}Moeda Contra fee${delimiter}Financeiro Moeda Contra (OLD: custo future)${delimiter}Financeiro Moeda Base-1${delimiter}custo Moeda Contra fee${delimiter}Premio s/corretagem (Code: payout)${delimiter}Prem s/corr anual (Code: yearPayout)${delimiter}Premio c/corr (Code: PayoutPlusFee)${delimiter}Prem c/corr anual (Code: YearPayoutPlusFee)${delimiter}Financeiro efet (Code: effectiveFinance)${delimiter}P&L check (Code: pnlCheck)${delimiter}P&L / custo Moeda Base (Code: pnlDivSpotFinance)${delimiter}N _ days (dias pro vencimento)${delimiter}Moeda Base buy amount${delimiter}Moeda Base buy price${delimiter}Moeda Base sel amount${delimiter}Moeda Base sel price${delimiter}Moeda Contra buy amount${delimiter}Moeda Contra buy price${delimiter}Moeda Contra sel amount${delimiter}Moeda Contra sel price${delimiter}PERPETUAL FUNDING RATE(PT: Perpétuo - Finaciamento)${delimiter}Perpetual Countdown (PT: Perpétuo - Contagem Regressiva)\n`

export async function saveHeader(): Promise<void> {
  write(header)
}

export async function saveOrder(order: Order, price: Price): Promise<Order> {
  append(format(order, price))
  return order
}

export async function savePrice(order: Order, price: Price, pnlCheck: number, pnlDivSpotFinance: number): Promise<Order> {
  append(format(order, price, Operation.STOP, pnlCheck, pnlDivSpotFinance))
  return order
}

function format(order: Order, price: Price, operation = Operation.START, pnlCheck = 0, pnlDivSpotFinance = 0) : string {
  return `${order.time.toLocaleString('pt-BT', {hour12: false})}${delimiter}${price.coinA.symbol} ${price.coinB.symbol}${delimiter}${price.coinA.symbol}${delimiter}${price.coinB.symbol}${delimiter}${formatOperation(operation)}${delimiter}${order.condition ? '1' : '0'}${delimiter}${order.coinA.amount}${delimiter}${order.coinA.price}${delimiter}${order.coinA.pricePlusFee}${delimiter}${order.coinA.fee}${delimiter}${order.coinA.finance}${delimiter}${order.coinA.financeMinusOne}${delimiter}${order.coinA.financePlusFee}${delimiter}${order.coinB.amount}${delimiter}${order.coinB.price}${delimiter}${order.coinB.pricePlusFee}${delimiter}${order.coinB.fee}${delimiter}${order.coinB.finance}${delimiter}${order.coinB.finance}${delimiter}${order.coinB.financeMinusOne}${delimiter}${order.payout}${delimiter}${order.yearPayout}${delimiter}${order.payoutPlusFee}${delimiter}${order.yearPayoutPlusFee}${delimiter}${order.effectiveFinance}${delimiter}${pnlCheck}${delimiter}${pnlDivSpotFinance}${delimiter}${order.days}${delimiter}${price.coinA.buyAmount}${delimiter}${price.coinA.buyPrice}${delimiter}${price.coinA.selAmount}${delimiter}${price.coinA.selPrice}${delimiter}${price.coinB.buyAmount}${delimiter}${price.coinB.buyPrice}${delimiter}${price.coinB.selAmount}${delimiter}${price.coinB.selPrice}${delimiter}${price.coinB.perpetualLastFundingRate}${delimiter}${perpetualCountdown(price)}\n`
}

function formatOperation(op: Operation): string { 
  return (op == Operation.START) ? 'MONTAR' : 'ZERAR'
}

function perpetualCountdown(price: Price): string { 
  if (price.coinB.perpetualNextFundingTime) {
    const today = new Date()
    const nextFundingTime = new Date(price.coinB.perpetualNextFundingTime)
    const diffMs: number = Math.abs(nextFundingTime.getTime() - today.getTime())
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000)
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000)
    return `${diffHrs}:${diffMins}`
  } else {
    return ""
  }
}
