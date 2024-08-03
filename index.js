//import fetch from 'node-fetch'
//const fetch = require('node-fetch')
import express from 'express'
import cron from 'node-cron'
const app = express()
import { GoodsExtractionService } from './services/goods.extraction.service.js'
import { GoodsStoreService } from './services/goods.store.service.js'
//import { server } from './api/index.js'
import auxiliaryApi from './api/routes/auxiliary.js'
import telegram from './services/telegram.js'
app.use('/flags', express.static('public'))
app.use('/api', auxiliaryApi)
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('test error')
})
const port = process.env.PORT || 4000
const runTimeRange = process.env.APP_TIME_RANGE || '*/1 * * * *'
const goodsStoreService = new GoodsStoreService()

//monitor().catch((error) => console.log(error))

cron.schedule(runTimeRange, () => {
  logMessage()
  monitor()
})
function logMessage() {
  console.log('Cron job executed at:', new Date().toLocaleString())
}

async function getProducts() {
  return await goodsStoreService.getAllProducts()
}

 function getActualGoodsInfo(goodsInitial) {
  const goodsExtractionService = new GoodsExtractionService()
  return Promise.all(
    goodsInitial.map(({ url, titleOpenTag, title }) => {
      return goodsExtractionService.loadProductInfo(url, titleOpenTag.concat(title))
    })
  )
}

/**
 * Monitors the initial products and updates them based on the actual product information.
 *
 * @return {Promise<Array<string>>} An array of strings containing the updated product information.
 */
async function monitor() {
  const goodsInitial = await getProducts()
  const actualInfo = await getActualGoodsInfo(goodsInitial)
  let index = 0

  const updatedGoods = goodsInitial.map(async ({ url, title, prices, status }) => {
    const goodInfo = `${url}  : ${actualInfo[index].status} ${actualInfo[index]?.prices || ''}`
    if (actualInfo[index]?.prices &&
      actualInfo[index].prices?.length > 1 &&
      prices.toString() !== actualInfo[index].prices.toString()
    ) {
      telegram.log(goodInfo)
      goodsStoreService.updateProductsInStorage(url, {prices: actualInfo[index].prices})
      goodsStoreService.updateProductsInStorage(url, { status: actualInfo[index].status })
    } else if (status !== actualInfo[index].status) { //if no discount but status updated
      telegram.log(goodInfo)
      goodsStoreService.updateProductsInStorage(url, {
        status: actualInfo[index].status
      })
    }
    index++
    return goodInfo
  })
  return await Promise.all(updatedGoods)
}

app.get('/', async (req, res) => {
  res.send(await monitor())
})

app.listen(port, async () => {
  console.log(port + ' is listening ok!!! ')
})
