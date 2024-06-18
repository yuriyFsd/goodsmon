import { HttpClientService } from './http.client.service.js'

export class GoodsExtractionService {

    /**
     * 
     * @param {string} url 
     * @param {string} productSubstring 
     * @returns []
     */
    async loadProductValues(url, productSubstring) {
        const productNotFoundMessage = "Can't find product block!"
        const priceNotFoundMessage = "Can't find cost, maybe not available!"
        const httpClientService = new HttpClientService()
        //console.log({ productSubstring })
        const htmlSource = await httpClientService.getProductPageHtml(url)
        const indexProductTitle = htmlSource.indexOf(productSubstring)
        const productOpenDivIndex = htmlSource.indexOf('<div', indexProductTitle)
        const productDivCloseIndex = this.findClosingTagIndex(htmlSource, productOpenDivIndex)

        if (indexProductTitle < 0 || productOpenDivIndex < 0 || productDivCloseIndex < 0) {
            return productNotFoundMessage
        }
        console.log({ indexProductTitle, productOpenDivIndex, productDivCloseIndex })
        const productHtmlBlock = htmlSource.substring(productOpenDivIndex, productDivCloseIndex)
        const productCost = this.extractValues(productHtmlBlock)
        console.log({pr: typeof productCost[0]})
        return productCost[0] > 1000000 ? priceNotFoundMessage : productCost
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
        // If no closing tag is found
        return -1
    }

    /**
     * @param {string} htmlString
     * returns []
     */
    extractValues(htmlString) {
        const matches = htmlString.match(/>\d+\.|>\d+/gm)
        //console.log({ matches })
        const values = []
        matches?.reduce((prevVal, currentVal, index) => {
            if (index % 2 === 1) {
                values.push(
                    parseFloat(prevVal.replace('>', '').concat(currentVal.replace('>', ''))) || null
                )
            }
            return currentVal
        })
        console.log(values)
        return values
        //return matches ? parseFloat(matches[0] + matches[1]) : null
    }
}
