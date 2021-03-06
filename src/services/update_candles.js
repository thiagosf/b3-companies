const moment = require('moment')
const b3quote = require('../b3quote')
const models = require('../models')

const delay = seconds => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, seconds * 1000)
  })
}

const updateCandles = async () => {
  console.time('updateCandles')
  try {
    const { Asset, AssetCandle } = models
    const assets = await Asset.scope('active').findAll()

    for (let i in assets) {
      const asset = assets[i]
      try {
        const quoteData = await b3quote(asset.code)
        if (quoteData.open) {
          const date = moment.utc(quoteData.updated)
            .startOf('day')
            .toDate()
          const options = {
            where: {
              asset_id: asset.id,
              date
            },
            defaults: {
              date,
              asset_id: asset.id,
              time_frame: '1d',
              open: quoteData.open,
              high: quoteData.max,
              low: quoteData.min,
              close: quoteData.current
            }
          }
          const [assetCandle, created] = await AssetCandle.findOrCreate(options)
          if (!created) {
            await assetCandle.strongUpdate(options.defaults)
          }
          await asset.update({
            open: quoteData.open,
            price: quoteData.current
          })
        } else {
          console.log('-- no quote data')
        }
      } catch (error) {
        console.log('-- error:', asset.code, error)
      }
      await delay(0.5)
    }
  } catch (error) {
    console.log('updateCandles error', error)
  }
  console.timeEnd('updateCandles')
}

module.exports = updateCandles
