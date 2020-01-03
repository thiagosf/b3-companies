const fs = require('fs')
const path = require('path')
const moment = require('moment')

const companies = async (req, res, next) => {
  try {
    const { models } = req
    const { Asset, AssetCandle } = models
    const { query } = req
    const options = {
      order: [['code', 'asc']]
    }
    const assets = await Asset.findAll(options)
    let data = []
    for (let i in assets) {
      const asset = assets[i]
      const item = await asset.publicData()
      const hasCandles = query.candles !== '' && query.candles !== undefined
      let addItem = true
      const count = hasCandles
        ? query.candles.split(',').length
        : 1
      const options = {
        where: {
          asset_id: asset.id
        },
        limit: count,
        order: [['date', 'desc']]
      }
      let itemCandle
      const assetCandles = await AssetCandle.findAll(options)
      if (assetCandles.length > 0) {
        itemCandle = await assetCandles[0].publicData()
      }
      let screenshot = {
        url: null,
        date: null
      }
      const fullPath = path.join(
        __dirname,
        '../../public/files/charts',
        `${asset.code}.png`
      )
      if (fs.existsSync(fullPath)) {
        const stat = fs.statSync(fullPath)
        screenshot.url = `/files/charts/${asset.code}.png`
        screenshot.date = stat.mtimeMs
      }
      if (hasCandles) {
        const candles = query.candles.split(',')
        candles.forEach((direction, index) => {
          const item = assetCandles[index]
          if (item) {
            const candleDirection = +item.close >= +item.open
              ? 'p'
              : 'n'
            addItem = addItem && direction === candleDirection
          } else {
            addItem = false
          }
        })
      }
      if (addItem) {
        data.push({
          ...item,
          screenshot,
          last_candle: itemCandle
        })
      }
    }
    res.send({ success: true, data })
  } catch (error) {
    next(error)
  }
}

module.exports = companies
