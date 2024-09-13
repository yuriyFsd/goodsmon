import fetch from 'node-fetch'

export class HttpClientService {
    async getProductPageHtml(url) {
        let response = await fetch(url)
        if (response.status !== 200) {
            // one more try to fetch page by URL as sometimes by first call it returns empty product page 
            response = await fetch(url)
        }
        return await response.text()
    }
}
 