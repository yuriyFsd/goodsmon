import fetch from 'node-fetch'
//const fetch = require('node-fetch')
import express from 'express'
import cron from 'node-cron'
const app = express()

const port = 3000

const goodsInitial = [
    {url: '/product/morozivo-90-g-svoa-linia-briket-mup', titleSubstring: '<h1 class="page-title product-page__title">Морозиво 90 г Своя лінія Брикет м/уп</h1>'},
    {url: '/product/morozivo-90g-lasunka-plombir-ice-cake-zi-smvanili-ta-z-kakao-u-pecivi-ta-kondglaz-z-arah', titleSubstring: '<h1 class="page-title product-page__title">Морозиво 90г Ласунка пломбір Ice-Cake зі см.ванілі та з какао у печиві та конд.глаз. з арах.</h1>'}
]

const vendorBaseUrl = 'https://www.atbmarket.com'
//const valueTopClass = 'class="product-value__top'
//const valueBottomClass = 'class="product-value__bottom'

;(function () {
    monitor()
})()

// cron.schedule('* * * * *', () => {
//     logMessage()
//     toRunByCrone()
// })
function logMessage() {
    console.log('Cron job executed at:', new Date().toLocaleString())
}

async function monitor() {
    const values = await Promise.all(
        goodsInitial.map(({ url, titleSubstring }) => {
            return loadProductValues(vendorBaseUrl + url, titleSubstring)
        })
    )
    console.log({values})
}

async function getProductPageHtml(url) {
    const response = await fetch(url)
    return await response.text()
}

async function loadProductValues(url, productSubstring) {
    const htmlSource = await getProductPageHtml(url)
    const indexProductTitle = htmlSource.indexOf(productSubstring)
    const productOpenDivIndex = htmlSource.indexOf('<div', indexProductTitle)
    const productDivCloseIndex = findClosingTagIndex(htmlSource, productOpenDivIndex)
    //console.log({indexProductTitle, productOpenDivIndex, productDivCloseIndex})
    const productHtmlBlock = htmlSource.substring(productOpenDivIndex, productDivCloseIndex)
    return extractValues(productHtmlBlock)
}

app.get('/', async (req, res) => {
    res.send(await loadProductValues)
})

app.listen(port, async () => {
    console.log(port + ' is listening ok!!! ')
})

/**
 * @param {string} htmlString
 * @param {any} openDivIndex
 * @param {string} [tagName='div']
 */
function findClosingTagIndex(htmlString, openDivIndex, tagName = 'div') {
    let stack = []
    const openTag = '<' + tagName
    const closeTag = `</${tagName}>`
    for (let i = openDivIndex; i < htmlString.length; i++) {
        if (htmlString[i] === '<') {
            // Check if it's an opening div tag
            if (htmlString.startsWith(openTag, i)) {
                stack.push(openTag)
            } else if (htmlString.startsWith(closeTag, i)) {
                // Check if it's a closing div tag
                stack.pop()
                // If the stack is empty, we've found the matching closing tag
                if (stack.length === 0) {
                    return i
                }
            }
        }
    }
    // If no closing tag is found
    return -1
}

/**
 * @param {string} htmlString
 */
function extractValues(htmlString) {
    const matches = htmlString.match(/>\d+\.|>\d+/gm)
    const values = []
    matches?.reduce((prevVal, currentVal, index) => {
        if(index % 2 === 1) {
            values.push(parseFloat(prevVal.replace('>', '').concat(currentVal.replace('>', ''))) || null)
        }
        return currentVal
    })
    console.log(values)
    return values
    //return matches ? parseFloat(matches[0] + matches[1]) : null
}
