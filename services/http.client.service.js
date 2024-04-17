import fetch from 'node-fetch'

export class HttpClientService {
    async getProductPageHtml(url) {
        const response = await fetch(url)
        return await response.text()
    }
}
 