const axios = require('axios')
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
    variation: null
  }
  if (data.BizSts.cd === 'OK' && data.Trad && data.Trad.length > 0) {
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
  let data
  if (useMock) {
    data = JSON.parse(utils.loadFixture('ELET3.json'))
  } else {
    const url = `http://cotacao.b3.com.br/mds/api/v1/instrumentQuotation/${code}`
    const response = await axios({
      url,
      method: 'get',
      timeout: 3000
    })
    data = response.data
  }
  return formatQuote(data)
}

module.exports = b3quote
