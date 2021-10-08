import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { AccountInfo } from '../types/accountinfo.type'
import { PremiumIndex } from '../types/index.type'
import { OrderBook } from '../types/orderbook.type'
import { publicApi } from './api'

export async function exchangeInfo(symbol: string): Promise<AxiosResponse<AccountInfo>> {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: `/api/v3/exchangeInfo?symbol=${symbol}`,
  }

  return await publicApi().request<AccountInfo>(config)
}

export async function spotDepth(symbol: string, limit = 5): Promise<AxiosResponse<OrderBook>> {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: `/api/v3/depth?symbol=${symbol}&limit=${limit}`,
  }

  return await publicApi().request<OrderBook>(config)
}

export async function futureDepth(symbol: string, limit = 5): Promise<AxiosResponse<OrderBook>> {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: `/dapi/v1/depth?symbol=${symbol}&limit=${limit}`,
  }

  return await publicApi().request<OrderBook>(config)
}

export async function futurePremiumIndex(symbol: string | undefined): Promise<AxiosResponse<PremiumIndex[]>> {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: '/dapi/v1/premiumIndex' + (symbol ? `?symbol=${symbol}` : ''),
  }

  return await publicApi().request<PremiumIndex[]>(config)
}
