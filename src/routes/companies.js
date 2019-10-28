const fs = require('fs')
const path = require('path')
const utils = require('../utils')

const companies = async (req, res, next) => {
  try {
    const data = JSON.parse(utils.loadData('all.json'))
    res.send({
      success: true,
      data: data.map(item => {
        item.aggregate = item.aggregate.map(aggregate => {
          const fullPath = path.join(
            __dirname,
            '../../public/files/charts',
            `${aggregate.code}.png`
          )
          let screenshot = null
          if (fs.existsSync(fullPath)) {
            screenshot = `/files/charts/${aggregate.code}.png`
          }
          aggregate.screenshot = screenshot
          return aggregate
        })
        return item
      })
    })
  } catch (error) {
    next(error)
  }
}

module.exports = companies
