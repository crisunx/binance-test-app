import 'dotenv/config'
import { depth, futureDepth } from '../services/exchange.service'

export async function calculateUseCase(): Promise<void> {
  const days = Math.floor((Date.parse(process.env.FUTURE_FINISH_DATE || '') - Date.now()) / 86400000)
  const spot = await depth(process.env.SPOT || '').then((res) => res.data)
  const future = await futureDepth(process.env.FUTURE || '').then((res) => res.data)

  const spotBuyPrice = spot.bids[0][0]
  const spotBuyAmount = spot.bids[0][1]
  const spotSelPrice = spot.asks[0][0]
  const spotSelAmount = spot.asks[0][1]
  const spotFinance = spotSelPrice * spotSelAmount

  const futureBuyPrice = future.bids[0][0]
  const futureBuyAmount = future.bids[0][1]
  const futureSelPrice = future.asks[0][0]
  const futureSelAmount = future.asks[0][1]
  const futureFinance = futureBuyPrice * futureBuyAmount

  const payout = ((futureBuyPrice / spotSelPrice) - 1) * 100
  const yearPayout = (Math.pow((1 + (payout / 100)),  (365 / days)) - 1) * 100

  console.log(`Dias vencimento: ${days}`)
  console.log(`Bitcoin spot --> Qtd Compra: ${spotBuyAmount} preco: ${spotBuyPrice} Qtd Venda: ${spotSelAmount} preco: ${spotSelPrice} financeiro: ${spotFinance}`)
  console.log(`Bitcoin future --> Qtd Compra: ${futureBuyAmount} preco: ${futureBuyPrice} Qtd Venda: ${futureSelAmount} preco: ${futureSelPrice} financeiro: ${futureFinance}`)
  console.log(`Premio: ${payout}`)
  console.log(`Premio Atualizado: ${yearPayout}`)
  console.log('---------------')
}
