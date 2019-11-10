const cache = require('../cache')

const cleanCache = async () => {
  const items = ['quote_alert']
  for (let i in items) {
    const item = items[i]
    await cache.cleanCache(item)
  }
}

module.exports = cleanCache
