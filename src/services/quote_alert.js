const cache = require('../cache')
const alert = require('../alert')
const utils = require('../utils')

const quoteAlert = async () => {
  const checkAlert = async (code, quote, item) => {
    const dayVariation = +((((+quote.current / +quote.open) - 1) * 100).toFixed(2))
    const minVariation = +(process.env.MIN_VARIATION || 2)

    if (dayVariation >= minVariation) {
      const message = `*${code}*: aumento de ${dayVariation}% no dia (${item.name}), preço: ${quote.current}`
      await cache.fetch({
        key: 'QUOTE_ALERT',
        options: {
          code,
          lifetime: 60 * 60 * 24
        },
        fn: async () => {
          await alert.sendMessage(message)
          return { code, dayVariation }
        }
      })
    }
  }

  try {
    const data = JSON.parse(utils.loadData('all.json'))
    for (let i in data) {
      const item = data[i]
      for (let j in item.aggregate) {
        const aggregate = item.aggregate[j]
        const { code, quote } = aggregate
        await checkAlert(code, quote, item)
      }
    }
  } catch (error) {
    console.log('quote alert error:', error)
  }
}

module.exports = quoteAlert
