import 'dotenv/config'
import { spotFee, futureFee  } from '../services/fees.service'
import { Fee } from '../types/fee.type'

const level = +(process.env.VIP || 0)

export async function getSpotFee(): Promise<Fee> {
  return await spotFee().then((res) => res.data.data[level])
}

export async function getFutureFee(): Promise<Fee> {
  return futureFee().then((res) => res.data.data[level])
}
