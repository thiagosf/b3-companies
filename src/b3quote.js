const utils = require('./utils')
let useMock = false

if (process.env.MOCK !== undefined) {
  useMock = process.env.MOCK === 'true'
}

const formatQuote = data => {
  let output = {
    open: null,
    max: null,
    min: null,
    average: null,
    current: null,
    variation: null,
    updated: Date.now()
  }
  if (
    data &&
    data.BizSts &&
    data.BizSts.cd === 'OK' &&
    data.Trad &&
    data.Trad.length > 0
  ) {
    output.open = +data.Trad[0].scty.SctyQtn.opngPric
    output.max = +data.Trad[0].scty.SctyQtn.maxPric
    output.min = +data.Trad[0].scty.SctyQtn.minPric
    output.average = +data.Trad[0].scty.SctyQtn.avrgPric
    output.current = +data.Trad[0].scty.SctyQtn.curPrc
    output.variation = +data.Trad[0].scty.SctyQtn.prcFlcn
  }
  return output
}

const b3quote = async code => {
  console.log('-- b3quote:', code, new Date())
  console.time(code)
  let data
  if (useMock) {
    data = JSON.parse(utils.loadFixture('ELET3.json'))
  } else {
    try {
      const url = `http://cotacao.b3.com.br/mds/api/v1/instrumentQuotation/${code}`
      const response = await utils.getAxios().request({
        url,
        method: 'get',
        timeout: 5000
      })
      data = response.data
    } catch (error) {
      console.log('---- error:', error.message)
    }
  }
  console.timeEnd(code)
  return formatQuote(data)
}

module.exports = b3quote
