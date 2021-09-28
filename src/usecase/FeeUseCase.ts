import 'dotenv/config'
import { spotFees, futureFees  } from '../services/fees.service'
import { Fee } from '../types/fee.type'

const level = +(process.env.VIP || 0)

export async function getSpotFee(): Promise<Fee> {
  return spotFees().then((res) => res.data.data[level])
}

export async function getFutureFee(): Promise<Fee> {
  return futureFees().then((res) => res.data.data[level])
}
