const cheerio = require('cheerio')
const axios = require('axios')
const utils = require('./utils')
let useMock = false

if (process.env.MOCK !== undefined) {
  useMock = process.env.MOCK === 'true'
}

const b3company = async (code, delay = 0) => {
  const url = `http://bvmf.bmfbovespa.com.br/pt-br/mercados/acoes/empresas/ExecutaAcaoConsultaInfoEmp.asp?CodCVM=${code}&ViewDoc=1&AnoDoc=2019&VersaoDoc=1&NumSeqDoc=80218`
  let $

  if (useMock) {
    $ = cheerio.load(utils.loadFixture('10456.html'))
  } else {
    const response = await axios({
      url,
      method: 'get',
      timeout: 3000
    })
    utils.writeFixture(`${code}.html`, response.data)
    $ = cheerio.load(response.data)
  }

  let output = {
    code,
    name: null,
    document: null,
    site: null,
    activity: null,
    codes: []
  }

  // Basic info
  $('#accordionDados .ficha tr').each((index, item) => {
    const value = $(item).find('td:nth-child(2)').text().trim()
    switch (index) {
      case 0:
        output.name = value
        break

      case 2:
        output.document = value
        break

      case 3:
        output.activity = value
        break

      case 5:
        output.site = value
        break
    }
  })

  // Codes
  $('.LinkCodNeg').each((index, item) => {
    output.codes.push($(item).text())
  })
  output.codes = [...new Set(output.codes)]
  output.codes = output.codes.filter(code => !!code)

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(output)
    }, delay)
  })
}

module.exports = b3company
