import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ServerTime } from '../types/servertime.type'
import { publicApi } from './api'

export async function serverTime(): Promise<AxiosResponse<ServerTime>> {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: '/api/v3/time',
  }

  return await publicApi().request<ServerTime>(config)
}
