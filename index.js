import fetch from 'node-fetch'
//const fetch = require('node-fetch')
import express from 'express'
const app = express()

const port = 3000
const outerUrl = 'https://google.com'
const productOwnUrl = '/product/morozivo-90-g-svoa-linia-briket-mup'

const vendorBaseUrl = 'https://www.atbmarket.com'
const priceTopClass = 'class="product-price__top'
const priceBottomClass = 'class="product-price__bottom'
const productSubstring =
    '<h1 class="page-title product-page__title">Морозиво 90 г Своя лінія Брикет м/уп</h1>'

async function getProductPageHtml() {
    const response = await fetch(vendorBaseUrl + productOwnUrl) //, { method: 'GET', body: { x: 23 } }
    //console.log({response})
    return await response.text()
}

app.get('/', async (req, res) => {
    const htmlSource = await getProductPageHtml()
    const indexProductTitle = htmlSource.indexOf(productSubstring)
    const productOpenDivIndex = htmlSource.indexOf('<div', indexProductTitle)
    const productDivCloseIndex = findClosingTagIndex(htmlSource, productOpenDivIndex)
    const productHtmlBlock = htmlSource.substring(productOpenDivIndex, productDivCloseIndex)
    const price = extractPrice(productHtmlBlock)
    res.send(price) //`port ${port} is listening to you`)
})

app.listen(port, async () => {
    const htmlSource = await getProductPageHtml()
    const indexProductTitle = htmlSource.indexOf(productSubstring)
    const productOpenDivIndex = htmlSource.indexOf('<div', indexProductTitle)
    const productDivCloseIndex = findClosingTagIndex(htmlSource, productOpenDivIndex)
    const productHtmlBlock = htmlSource.substring(productOpenDivIndex, productDivCloseIndex)
    const price = extractPrice(productHtmlBlock)
    //console.log(productHtmlBlock)
    //const indexPriceTop = htmlSource.indexOf(priceTopClass)
    //const indexPriceBottom = htmlSource.indexOf(priceBottomClass)
    //console.log(productOpenDivIndex, indexPriceTop, indexPriceBottom)

    console.log(port + ' is listening ok!!! ' + price )
})


/**
 * @param {string} htmlString
 * @param {any} openDivIndex
 * @param {string} [tagName='div'] 
 */
function findClosingTagIndex(htmlString, openDivIndex, tagName = 'div') {
    let stack = [];
    const openTag = '<' + tagName
    const closeTag = `</${tagName}>`
    for (let i = openDivIndex; i < htmlString.length; i++) {
        if (htmlString[i] === '<') {
        // Check if it's an opening div tag
            if (htmlString.startsWith(openTag, i)) {
                stack.push(openTag);
            } else if (htmlString.startsWith(closeTag, i)) {
                // Check if it's a closing div tag
                stack.pop();
                // If the stack is empty, we've found the matching closing tag
                if (stack.length === 0) {
                    return i;
                }
            }
        }
    }
    // If no closing tag is found
    return -1;
}

/**
 * @param {string} htmlString
 */
function extractPrice(htmlString) {
    const regex = /\d+\.|\d+/gm;
    const matches = htmlString.match(regex);
    return matches ? parseFloat(matches[0] + matches[1]) : null;
}