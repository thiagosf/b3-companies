const TelegramBot = require('node-telegram-bot-api')

module.exports = {
  sendMessage (message) {
    const token = process.env.TELEGRAM_TOKEN
    const bot = new TelegramBot(token, { polling: true })
    return bot.sendMessage(process.env.TELEGRAM_GROUP, message, {
      parse_mode: 'Markdown'
    })
  }
}
