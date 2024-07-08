//import fetch from 'node-fetch'
//const fetch = require('node-fetch')
import express from 'express'
import cron from 'node-cron'
const app = express()
import { GoodsExtractionService } from './services/goods.extraction.service.js'
//import { server } from './api/index.js'
import auxiliaryApi from './api/routes/auxiliary.js'
import telegram from './services/telegram.js'
app.use('/flags', express.static('public'))
app.use('/api', auxiliaryApi)
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('test error')
})
const port = process.env.PORT || 4000;
const runTimeRange = process.env.APP_TIME_RANGE || '*/10 * * * *'

const goodsInitial = [
  {
    url: 'https://www.atbmarket.com/product/morozivo-90-g-svoa-linia-briket-mup',
    titleOpenTag: '<h1 class="page-title product-page__title">',
    title: 'Морозиво 90 г Своя лінія Брикет м/уп'
  },
  {
    url: 'https://www.atbmarket.com/product/morozivo-90g-lasunka-plombir-ice-cake-zi-smvanili-ta-z-kakao-u-pecivi-ta-kondglaz-z-arah',
    titleOpenTag: '<h1 class="page-title product-page__title">',
    title:
      'Морозиво 90г Ласунка пломбір Ice-Cake зі см.ванілі та з какао у печиві та конд.глаз. з арах.'
  },
  {
    url: 'https://www.atbmarket.com/product/morozivo-100-g-oliver-smith-lakomij-plombir-u-zbitij-konditerskij-glazuri',
    titleOpenTag: '<h1 class="page-title product-page__title">',
    title: 'Морозиво 100  г Oliver Smith Лакомий пломбір у збитій кондитерській глазурі'
  },
  {
    url: 'https://www.atbmarket.com/product/ikra-310-g-veres-z-kabackiv-ekstra-skbanka',
    titleOpenTag: '<h1 class="page-title product-page__title">',
    title: 'Ікра 310 г Верес з кабачків Екстра ск/банка'
  }
]

monitor().catch((error) => console.log(error))

cron.schedule(runTimeRange, () => {
    logMessage()
    monitor()
})
function logMessage() {
  console.log('Cron job executed at:', new Date().toLocaleString())
}

async function monitor() {
    const goodsExtractionService = new GoodsExtractionService()
    const values = await Promise.all(
        goodsInitial.map(({ url, titleOpenTag, title }) => {
            return goodsExtractionService.loadProductValues(url, titleOpenTag.concat(title))
        })
    )
    let index = 0
    const updatedGoods = goodsInitial.map(({ url, title }) => {
        const goodInfo = `${url}  : ${values[index]}`
        if (typeof values[index] === 'object' && values[index]?.length > 1) {
            telegram.log(goodInfo)
        }
        index++
        return goodInfo
    })
    console.log({ updatedGoods })
    return updatedGoods
}

app.get('/', async (req, res) => {
    res.send(await monitor())
})

app.listen(port, async () => {
  console.log(port + ' is listening ok!!! ')
})
