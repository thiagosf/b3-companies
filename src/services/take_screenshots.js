const screenshot = require('../screenshot')
const utils = require('../utils')

const takeScreenshots = async () => {
  try {
    let storedData = utils.loadData('all.json')
    storedData = JSON.parse(storedData)

    for (let i in storedData) {
      let item = storedData[i]
      item.aggregate = item.aggregate || []

      if (item.aggregate.length > 0) {
        for (let j in item.aggregate) {
          let aggregate = item.aggregate[j]
          const { code } = aggregate

          console.time(code)
          console.log('-- screenshot code:', code)

          try {
            await screenshot(code)
          } catch (error) {
            console.log('quote error', code, error.message)
          }

          console.timeEnd(code)
        }
      }
    }

    return storedData
  } catch (error) {
    console.log('takeScreenshots error', error)
  }
}

module.exports = takeScreenshots
