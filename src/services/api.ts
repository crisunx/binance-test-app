import axios, { AxiosInstance } from 'axios'
import 'dotenv/config'

export function privateApi(): AxiosInstance {
  const api: AxiosInstance = axios.create({
    timeout: 5000,
    baseURL: process.env.API_URL,
    headers: { 'X-MBX-APIKEY': process.env.API_KEY },
  })

  return api
}

export function publicApi(): AxiosInstance {
  const publicApi: AxiosInstance = axios.create({
    timeout: 5000,
    baseURL: process.env.API_URL,
  })

  return publicApi
}
