import 'dotenv/config'
import { getFutureFee, getSpotFee } from './FeeUseCase'
import { startMonitoring } from './MonitorUseCase'
import { makeOrder } from './OrderUseCase'
import { takePrice } from './PriceUseCase'

const interval = +(process.env.CRAWLER_INTERVAL || 3000)
const coinSpot: string = process.env.SPOT || ''
const coinFuture: string[] = JSON.parse(process.env.FUTURE || '')
const finishDate: string[] = JSON.parse(process.env.FUTURE_FINISH_DATE || '')

export async function startTrading(): Promise<void> {
  const spotFee = await getSpotFee()
  const futureFee = await getFutureFee()

  const price = await takePrice(coinSpot, coinFuture[0], spotFee, futureFee)
  const orderDays = Math.floor((Date.parse(finishDate[0]) - Date.now()) / 86400000)
  const order = await makeOrder(price, orderDays)
  
  console.log(`Order: ${order.time.toISOString()} payout: ${order.payout}`)

  console.log('Starting monitoring...')

  setInterval(async () => {
    coinFuture.forEach((coin, idx) => {
      const days: number = Math.floor((Date.parse(finishDate[idx]) - Date.now()) / 86400000)
      startMonitoring(coinSpot, coin, order, spotFee, futureFee, days)
    }) 
  }, interval)
}
