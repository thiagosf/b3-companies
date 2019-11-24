const fundamentus = require('../fundamentus')
const models = require('../models')

const updateFundamentus = async () => {
  console.time('updateFundamentus')
  try {
    const { Asset, AssetCandle } = models
    const assets = await Asset.scope('active').findAll()

    for (let i in assets) {
      const asset = assets[i]
      try {
        const fundamentusData = await fundamentus(asset.code)
        if (fundamentusData) {
          asset.strongUpdate({
            p_l: fundamentusData.indicators.p_l,
            p_vp: fundamentusData.indicators.p_vp
          })
        }
      } catch (e) {
        console.log('-- error:', asset.code, e)
      }
    }
  } catch (error) {
    console.log('updateFundamentus error', error)
  }
  console.timeEnd('updateFundamentus')
}

module.exports = updateFundamentus
