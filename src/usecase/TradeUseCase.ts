import 'dotenv/config'
import { Order } from '../models/order'
import { serverTime } from '../services/time.service'
import { Coin, CoinOperation, Type } from '../types/coin.type'
import { Fee } from '../types/fee.type'
import { getFutureFee, getSpotFee } from './FeeUseCase'
import { startMonitoring } from './MonitorUseCase'
import { makeOrder } from './OrderUseCase'
import { saveHeader } from './PersistUseCase'
import { takePrice } from './PriceUseCase'

const interval = +(process.env.CRAWLER_INTERVAL || 3000)
const operations: CoinOperation[] = JSON.parse(process.env.OPERATIONS || '')

export async function startTrading(): Promise<void> {
  await saveHeader()

  const orders = await startPosition()

  await startMonitor(orders)
}

async function startMonitor(orders : Order[]): Promise<void> {
  console.log('Starting monitoring...')

  setInterval(async () => {
    const time = await serverTime().then((res) => new Date(res.data.serverTime))
    
    operations.forEach(async (op, i) => {
      const coinAFee = await getFee(op.coinA)
      const coinBFee = await getFee(op.coinB)
      const days = Math.floor((Date.parse(op.coinB.date) - Date.now()) / 86400000) | 0

      startMonitoring(op.coinA, op.coinB, orders[i], coinAFee, coinBFee, days, time)
    })
  }, interval)
}

async function startPosition(): Promise<Order[]> {
  const orders : Order[] = []

  const time = await serverTime().then((res) => new Date(res.data.serverTime))

  operations.forEach(async (op) => {
    const coinAFee = await getFee(op.coinA)
    const coinBFee = await getFee(op.coinB)
    const price = await takePrice(op.coinA, op.coinB, coinAFee, coinBFee, time)
    const orderDays = Math.floor((Date.parse(op.coinB.date) - Date.now()) / 86400000) | 0
    
    orders.push(await makeOrder(price, orderDays))
    
    console.log(`Order: ${op.coinA.symbol}|${op.coinB.symbol} payout: ${orders[0].payout}`)
  })

  return orders
}

async function getFee(coin: Coin) : Promise<Fee> {
  if (coin.type == Type.SPOT) {
    return await getSpotFee()
  } else {
    return await getFutureFee()
  }
}