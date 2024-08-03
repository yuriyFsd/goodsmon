import fetch from 'node-fetch' //import fetch from 'node-fetch'

export class HttpClientService {
    async getProductPageHtml(url) {
        let response = await fetch(url)
        if (response.status !== 200) {
            response = await fetch(url)
        }
        return await response.text()
    }
}
 