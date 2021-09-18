import { AxiosRequestConfig, AxiosResponse } from 'axios'
import crypto, { BinaryLike } from 'crypto'
import { AccountInfo } from '../types/accountinfo.type'
import { privateApi } from './api'
import { time } from './time.service'

export async function accountInfo(): Promise<AxiosResponse<AccountInfo>> {
  const recvWindow = 60000

  const timestamp = await time().then((resp) => resp.data.serverTime)

  const signature = crypto
    .createHmac('sha256', process.env.SECRET_KEY as BinaryLike)
    .update(`timestamp=${timestamp}&recvWindow=${recvWindow}`)
    .digest('hex')

  const config: AxiosRequestConfig = {
    method: 'GET',
    url: `/v3/account?timestamp=${timestamp}&recvWindow=${recvWindow}&signature=${signature}`,
  }

  return await privateApi().request<AccountInfo>(config)
}
