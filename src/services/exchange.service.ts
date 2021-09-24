import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { AccountInfo } from '../types/accountinfo.type'
import { OrderBook } from '../types/orderbook.type'
import { publicApi } from './api'

export async function exchangeInfo(symbol: string): Promise<AxiosResponse<AccountInfo>> {

  const config: AxiosRequestConfig = {
    method: 'GET',
    url: `/api/v3/exchangeInfo?symbol=${symbol}`,
  }

  return await publicApi().request<AccountInfo>(config)
}

export async function depth(symbol: string, limit = 5): Promise<AxiosResponse<OrderBook>> {
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
