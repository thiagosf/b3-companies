const fs = require('fs')
const path = require('path')
const moment = require('moment')
const _getFilters = ({ query, models }) => {
  let output = {}
  if (query.candles) {
    const { sequelize } = models
    const { Op } = sequelize.Sequelize
    const firstDate = moment.utc()

    const items = query.candles.split(',')
      .map(item => {
        const signal = item === 'n' ? '<' : '>'
        const date = firstDate.subtract(1, 'days')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        return `
          (close ${signal} open and date = '${date}')
        `
      })

    const count = items.length
    const field = sequelize.literal(`
      (
        SELECT count(id) AS total FROM asset_candles AS ac
        WHERE ac.asset_id = Asset.id and
        (
          ${items.join('OR')}
        )
      ) = ${count}
    `)

    output.where = {
      [Op.and]: field
    }
  }
  return output
}

const companies = async (req, res, next) => {
  try {
    const { models } = req
    const { Asset, AssetCandle } = models
    const { query } = req
    const options = {
      ..._getFilters({ query, models }),
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
