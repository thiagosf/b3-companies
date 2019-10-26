const cheerio = require('cheerio')
const utils = require('./utils')
let useMock = false

if (process.env.MOCK !== undefined) {
  useMock = process.env.MOCK === 'true'
}

const b3company = async (id, delay = 0) => {
  const url = `http://bvmf.bmfbovespa.com.br/pt-br/mercados/acoes/empresas/ExecutaAcaoConsultaInfoEmp.asp?CodCVM=${id}&ViewDoc=1&AnoDoc=2019&VersaoDoc=1&NumSeqDoc=80218`
  let $

  if (useMock) {
    $ = cheerio.load(utils.loadFixture('10456.html'))
  } else {
    const response = await utils.getAxios().request({
      url,
      method: 'get',
      timeout: 5000
    })
    utils.writeFixture(`${id}.html`, response.data)
    $ = cheerio.load(response.data)
  }

  let output = {
    id,
    name: null,
    document: null,
    site: null,
    activity: null,
    codes: [],
    updated: Date.now()
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
