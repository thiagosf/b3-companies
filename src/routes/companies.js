const fs = require('fs')
const path = require('path')

const companies = async (req, res, next) => {
  try {
    const { Asset, AssetCandle } = req.models
    const options = {
      order: [['code', 'asc']]
    }
    const assets = await Asset.findAll(options)
    let data = []
    for (let i in assets) {
      const asset = assets[i]
      const item = await asset.publicData()
      const options = {
        where: {
          asset_id: asset.id
        },
        limit: 1,
        order: [['date', 'desc']]
      }
      let itemCandle
      const assetCandle = await AssetCandle.findOne(options)
      if (assetCandle) {
        itemCandle = await assetCandle.publicData()
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
      data.push({
        ...item,
        screenshot,
        last_candle: itemCandle
      })
    }
    res.send({ success: true, data })
  } catch (error) {
    next(error)
  }
}

module.exports = companies
