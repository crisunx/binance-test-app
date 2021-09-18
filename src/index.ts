import 'dotenv/config'
import { accountInfo } from './services/account.service'

console.log('Starting monitoring...')

setInterval(async () => {
  const info = await accountInfo()
  console.log(info)
}, 3000)
