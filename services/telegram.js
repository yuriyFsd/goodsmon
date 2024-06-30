import https from 'https'
import 'dotenv/config'

const apiUrl = 'api.telegram.org/bot'
const botId = process.env.TG_BOT_TK
const chatId = process.env.TG_CHAT_ID

class TelegramLogger {
    l(message) {
        https.get(`https://${apiUrl}${botId}/sendMessage?chat_id=${chatId}&text=${message}`)
    }
    async log(message) {
        return await https.get(
            `https://${apiUrl}${botId}/sendMessage?chat_id=${chatId}&text=${JSON.stringify(
                message
            )}`
        )
    }
}

export default new TelegramLogger()
