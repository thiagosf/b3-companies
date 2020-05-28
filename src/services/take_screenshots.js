const screenshot = require('../screenshot')
const models = require('../models')

const delay = seconds => {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000)
  })
}

const takeScreenshots = async () => {
  console.time('takeScreenshots')
  try {
    const { Asset } = models
    const assets = await Asset.scope('active').findAll()

    for (let i in assets) {
      const asset = assets[i]
      console.log('-- code:', asset.code)
      try {
        await screenshot(asset.code, 'D')
        await delay(3)
        await screenshot(asset.code, 'W')
        await delay(3)
        await screenshot(asset.code, 'M')
      } catch (error) {
        console.log('-- error:', asset.code, error)
      }
      await delay(5)
    }
  } catch (error) {
    console.log('takeScreenshots error', error)
  }
  console.timeEnd('takeScreenshots')
}

module.exports = takeScreenshots
