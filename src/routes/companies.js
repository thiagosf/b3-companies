const utils = require('../utils')

const companies = async (req, res, next) => {
  try {
    const data = JSON.parse(utils.loadData('all.json'))
    res.send({
      success: true,
      data
    })
  } catch (error) {
    next(error)
  }
}

module.exports = companies
