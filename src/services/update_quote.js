const b3quote = require('../b3quote')
const utils = require('../utils')

const updateQuote = async () => {
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
          console.log('-- update code:', code)

          let quoteData = null

          try {
            quoteData = await b3quote(code)
          } catch (error) {
            console.log('quote error', code, error.message)
          }

          console.timeEnd(code)

          if (quoteData) {
            aggregate.quote = quoteData
            item.aggregate[j] = aggregate
          }
        }
      }

      storedData[i] = item
      utils.writeData('all.json', JSON.stringify(storedData))
    }

    return storedData
  } catch (error) {
    console.log('updateQuote error', error)
  }
}

module.exports = updateQuote
