import { HttpClientService } from './http.client.service.js'
//import { writeFile } from 'node:fs/promises'

const NOTAVAILABLE_TEXT = 'Немає в наявності'
const COST_UPPER_LIMIT = 1000000

export class GoodsExtractionService {
  /**
   *
   * @param {string} url
   * @param {string} productSubstring
   * @returns []
   */
  async loadProductInfo(url, productSubstring) {
    const productNotFoundMessage = "Can't find product block!"
    const priceNotFoundMessage = "Can't find cost, maybe not available!"
    const availableMessage = 'available'

    const httpClientService = new HttpClientService()
    const htmlSource = await httpClientService.getProductPageHtml(url)
    //await writeFile('goods.html', htmlSource, 'utf8')
    if (this.isProductNonAvailable(htmlSource)) {
      return { status: 'Not available at the moment' }
    }
    const indexProductTitle = htmlSource.indexOf(productSubstring)
    const productOpenDivIndex = htmlSource.indexOf('<div', indexProductTitle)
    const productDivCloseIndex = this.findClosingTagIndex(htmlSource, productOpenDivIndex)
    console.log({ indexProductTitle, productOpenDivIndex, productDivCloseIndex })
    if (indexProductTitle < 0 || productOpenDivIndex < 0 || productDivCloseIndex < 0) {
      return { status: productNotFoundMessage }
    }
    const productHtmlBlock = htmlSource.substring(productOpenDivIndex, productDivCloseIndex)
    const productCost = this.extractValues(productHtmlBlock)

    if (productCost[0] > COST_UPPER_LIMIT) {
      return { status: priceNotFoundMessage }
    }
    return {
      prices: productCost,
      status: availableMessage
    }
  }

  /**
   * @param {string} htmlSource
   */
  isProductNonAvailable(htmlSource) {
    return htmlSource.includes(NOTAVAILABLE_TEXT)
  }

  /**
   * @param {string} htmlString
   * @param {any} openDivIndex
   * @param {string} [tagName='div']
   */
  findClosingTagIndex(htmlString, openDivIndex, tagName = 'div') {
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
    return -1 //no closing tag is found
  }

  /**
   * @param {string} htmlString
   * returns []
   */
  extractValues(htmlString) {
    const matches = htmlString.match(/>\d+\.|>\d+/gm)
    const values = []
    matches?.reduce((prevVal, currentVal, index) => {
      if (index % 2 === 1) {
        values.push(
          parseFloat(prevVal.replace('>', '').concat(currentVal.replace('>', ''))) || null
        )
      }
      return currentVal
    })
    return values
  }
}
