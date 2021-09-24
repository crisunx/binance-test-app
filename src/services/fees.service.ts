import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Fees } from '../types/fee.type'
import { publicApi } from './api'

export async function futureFee(): Promise<AxiosResponse<Fees>> {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: '/bapi/futures/v1/public/delivery/trade-level/get',
  }

  return await publicApi().request<Fees>(config)
}

export async function spotFee(): Promise<AxiosResponse<Fees>> {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: '/bapi/accounts/v1/public/account/trade-level/get',
  }

  return await publicApi().request<Fees>(config)
}
