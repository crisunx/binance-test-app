import 'dotenv/config'
import { calculateUseCase } from './usecase/CalculateUseCase'

console.log('Starting monitoring...')

setInterval(async () => {
  calculateUseCase()
}, 3000)
