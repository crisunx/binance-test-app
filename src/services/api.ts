import axios, { AxiosInstance } from 'axios'
import 'dotenv/config'

export function privateApi(): AxiosInstance {
  return axios.create({
    timeout: 10000,
    baseURL: process.env.API_URL,
    headers: { 'X-MBX-APIKEY': process.env.API_KEY },
  })
}

export function publicApi(): AxiosInstance {
  return axios.create({
    timeout: 10000,
    baseURL: process.env.API_URL,
  })
}
