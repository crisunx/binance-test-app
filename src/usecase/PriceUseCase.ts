import 'dotenv/config'
import { Price } from '../models/price'
import { futureDepth, futurePremiumIndex, spotDepth } from '../services/exchange.service'
import { Coin, Type } from '../types/coin.type'
import { Fee } from '../types/fee.type'
import { PremiumIndex } from '../types/index.type'
import { OrderBook } from '../types/orderbook.type'

export async function takePrice(coinA: Coin, coinB: Coin, coinAFee: Fee, coinBFee: Fee, time: Date): Promise<Price> {
  const coinAOrderBook = await getOrderBook(coinA)
  const coinBOrderBook = await getOrderBook(coinB)
  const coinAPremiumIndex = await getPremiumIndex(coinA)
  const coinBPremiumIndex = await getPremiumIndex(coinB)

  const coinABuyPrice = coinAOrderBook.bids[0][0]
  const coinABuyAmount = coinAOrderBook.bids[0][1]
  const coinASelPrice = coinAOrderBook.asks[0][0]
  const coinASelAmount = coinAOrderBook.asks[0][1]

  const coinBBuyPrice = coinBOrderBook.bids[0][0]
  const coinBBuyAmount = coinBOrderBook.bids[0][1]
  const coinBSelPrice = coinBOrderBook.asks[0][0]
  const coinBSelAmount = coinBOrderBook.asks[0][1]

  return {
    time: time,
    coinA: {
      type: coinA.type,
      symbol: coinA.symbol,
      buyPrice: coinABuyPrice,
      buyAmount: coinABuyAmount,
      selPrice: coinASelPrice,
      selAmount: coinASelAmount,
      fee: coinAFee.takerCommission,
      perpetualLastFundingRate: (coinAPremiumIndex ? coinAPremiumIndex.lastFundingRate : 0),
      perpetualNextFundingTime: (coinAPremiumIndex ? new Date(coinAPremiumIndex.nextFundingTime) : undefined),
    },
    coinB: {
      type: coinB.type,
      symbol: coinB.symbol,
      buyPrice: coinBBuyPrice,
      buyAmount: coinBBuyAmount,
      selPrice: coinBSelPrice,
      selAmount: coinBSelAmount,
      fee: coinBFee.takerCommission,
      perpetualLastFundingRate: (coinBPremiumIndex ? coinBPremiumIndex.lastFundingRate : 0),
      perpetualNextFundingTime: (coinBPremiumIndex ? new Date(coinBPremiumIndex.nextFundingTime) : undefined),
    },
  }
}

async function getPremiumIndex(coin: Coin): Promise<PremiumIndex|undefined>  {
  if (coin.type == Type.PERP) {
    return await futurePremiumIndex(coin.symbol).then((res) => res.data[0])
  } else {
    return undefined
  }
}

async function getOrderBook(coin: Coin): Promise<OrderBook>  {
  if (coin.type == Type.SPOT) {
    return await spotDepth(coin.symbol).then((res) => res.data)
  } else {
    return await futureDepth(coin.symbol).then((res) => res.data)
  }
}