import https from 'https'

const apiUrl = 'api.telegram.org/bot'
const botId = ''
const chatId = ''

class TelegramLogger {
    l(message) {
        https.get(`https://${apiUrl}${botId}/sendMessage?chat_id=${chatId}&text=${message}`)
    }
    async log(message) {
        const res = await https.get(
            `https://${apiUrl}${botId}/sendMessage?chat_id=${chatId}&text=${JSON.stringify(
                message
            )}`
        )
        //console.log({res})
    }
}

export default new TelegramLogger()
