const cache = require('../cache')
const alert = require('../alert')
const models = require('../models')

const quoteAlert = async () => {
  const checkAlert = async (code, quote, item) => {
    const dayVariation = +((((+quote.current / +quote.open) - 1) * 100).toFixed(2))
    const minVariation = +(process.env.MIN_VARIATION || 5)

    if (
      dayVariation >= minVariation ||
      dayVariation <= (minVariation * -1)
    ) {
      const directionMessage = dayVariation < 0 ? 'queda' : 'aumento'
      const message = `*${code}*: ${directionMessage} de ${dayVariation}% no dia (${item.name}), preço: ${quote.current}`

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
    const { Asset, AssetCandle } = models
    const assets = await Asset.scope('active').findAll()

    for (let i in assets) {
      const asset = assets[i]
      const assetCandle = await AssetCandle.findOne({
        where: {
          asset_id: asset.id
        },
        order: [['date', 'desc']]
      })
      if (assetCandle) {
        const quote = {
          current: +assetCandle.close,
          open: +assetCandle.open
        }
        await checkAlert(asset.code, quote, asset)
      }
    }
  } catch (error) {
    console.log('quote alert error:', error)
  }
}

module.exports = quoteAlert
