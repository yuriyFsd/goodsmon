//import fetch from 'node-fetch'
//const fetch = require('node-fetch')
import express from 'express'
import cron from 'node-cron'
import path from 'path'
import bodyParser from 'body-parser'
import { fileURLToPath } from 'url'
const app = express()
app.use(express.urlencoded({ extended: true }));

import { GoodsExtractionService } from './services/goods.extraction.service.js'
import { GoodsStoreService } from './services/goods.store.service.js'

import path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//import { server } from './api/index.js'
import auxiliaryApi from './api/routes/auxiliary.js'
import telegram from './services/telegram.js'
import { ManageGoodsService } from './services/manage.goods.service.js'
app.use('/flags', express.static('public'))
app.use('/api', auxiliaryApi)
// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }))

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('test error')
})

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directo
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('/public')) //app.use(express.static(__dirname + '/public'))

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

  const updatedGoods = goodsInitial.map(async ({ url, title, prices, status }, index) => {
    const goodInfo = `${url}  : ${actualInfo[index].status} ${actualInfo[index]?.prices || ''}`
    if (actualInfo[index]?.prices &&
      actualInfo[index].prices?.length > 1 &&
      prices?.toString() !== actualInfo[index].prices.toString()
    ) {
      processDiscountedProduct(url, goodInfo, actualInfo[index])
    } else if (status !== actualInfo[index].status) { //if no discount but status updated
      processUpdatedProduct(url, goodInfo, actualInfo[index])
    }
    return goodInfo
  })
  return await Promise.all(updatedGoods)
}

function processDiscountedProduct(url, goodInfo, { prices, status }) {
  telegram.log(goodInfo)
  goodsStoreService.updateProductsInStorage(url, { prices })
  goodsStoreService.updateProductsInStorage(url, { status })
}

function processUpdatedProduct(url, goodInfo, { status }) {
  telegram.log(goodInfo)
  goodsStoreService.updateProductsInStorage(url, { status })
}

app.get('/', async (req, res) => {
  res.send(await monitor())
})

app.get('/add', async (req, res) => {
  res.sendFile( path.join(__dirname, 'public', 'addNew.html'))
})

app.post('/addNewProduct', async (req, res) => {
  const { url, title, titleOpenTag } = req.body
  console.log({ url, title, titleOpenTag })
  await goodsStoreService.addNewProduct(url, title, titleOpenTag)
  // res.redirect('/')
})

app.get('/test', (req, res) => {
   console.log(__dirname)
  res.sendFile(path.join(__dirname, 'public', '/test.html'))
})

app.post('/submit', (req, res) => {
  console.log('submit post!!!')
  const prodUrl = req.body.product_url
  const prodTitle = req.body.product_title
  const manageGoodsService = new ManageGoodsService
  if (manageGoodsService.addNewProduct(prodUrl, prodTitle)) {
    res.send(` ${prodTitle} stored!`)
  } else {
    res.send(` ${prodTitle} NOT stored!`)
  }  
})

app.listen(port, async () => {
  console.log(port + ' is listening ok!!! ')
})

