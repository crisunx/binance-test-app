import 'dotenv/config'
import { getFutureFee, getSpotFee } from './FeeUseCase'
import { startMonitoring } from './MonitorUseCase'
import { makeOrder } from './OrderUseCase'
import { saveOrder } from './PersistUseCase'

const interval = +(process.env.CRAWLER_INTERVAL || 3000)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function trading(): Promise<void> {
  const spotFee = await getSpotFee()
  const futureFee = await getFutureFee()
  const order = await saveOrder(await makeOrder(spotFee, futureFee))

  console.log(`Make order: ${order.time.toISOString()} payout: ${order.payout}`)

  await delay(interval)

  console.log('Starting monitoring...')
  setInterval(async () => {
    startMonitoring(order, spotFee, futureFee)
  }, interval)
}
