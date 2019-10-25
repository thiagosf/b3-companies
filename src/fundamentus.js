const cheerio = require('cheerio')
const utils = require('./utils')
let useMock = false

if (process.env.MOCK !== undefined) {
  useMock = process.env.MOCK === 'true'
}

const fundamentus = async code => {
  const url = `https://www.fundamentus.com.br/detalhes.php?papel=${code}`
  let $

  if (useMock) {
    $ = cheerio.load(utils.loadFixture('ALPA3.html'))
  } else {
    const response = await utils.getAxios().request({
      url,
      method: 'get',
      timeout: 5000
    })
    utils.writeFixture(`${code}.html`, response.data)
    $ = cheerio.load(response.data)
  }

  let output = {
    market_value: null, // Valor de mercado
    firm_value: null, // Valor da firma
    last_balance: null, // Últ balanço processado
    asset_count: null, // Nro. Ações,
    indicators: {
      p_l: null,
      p_vp: null,
      p_ebit: null,
      psr: null,
      p_actives: null, // P/Ativos
      p_working_capital: null, // P/Cap. Giro
      p_net_current_assets: null, // P/Ativ Circ Liq
      div_yield: null, // Div. Yield
      ev_ebit: null, // EV / EBIT
      spin_assets: null, // Giro Ativos
      net_revenue_growth_5y: null, // Cres. Rec (5a)
      lpa: null,
      vpa: null,
      gross_margin: null, // Marg. Bruta
      ebit_margin: null, // Marg. EBIT
      liquid_margin: null, // Marg. Líquida
      ebit_active: null, // EBIT / Ativo
      roic: null, // ROIC
      roe: null, // ROE
      total_gross_debt: null, // Div Br/ Patrim
    },
    updated: Date.now()
  }

  const indicadorReplaces = {
    '?p/l': 'p_l',
    '?p/vp': 'p_vp',
    '?p/ebit': 'p_ebit',
    '?psr': 'psr',
    '?p/ativos': 'p_actives',
    '?p/cap. giro': 'p_working_capital',
    '?p/ativ circ liq': 'p_net_current_assets',
    '?div. yield': 'div_yield',
    '?ev / ebit': 'ev_ebit',
    '?giro ativos': 'spin_assets',
    '?cres. rec (5a)': 'net_revenue_growth_5y',
    '?lpa': 'lpa',
    '?vpa': 'vpa',
    '?marg. bruta': 'gross_margin',
    '?marg. ebit': 'ebit_margin',
    '?marg. líquida': 'liquid_margin',
    '?ebit / ativo': 'ebit_active',
    '?roic': 'roic',
    '?roe': 'roe',
    '?div br/ patrim': 'total_gross_debt',
  }

  $('.w728 td').each((index, item) => {
    const label = $(item).text().trim().toLowerCase()
    const value = $(item).next().text().trim()
    const formatedValue = utils.toDecimal(value)

    if (indicadorReplaces[label]) {
      output.indicators[indicadorReplaces[label]] = formatedValue
    } else {
      switch (label) {
        case '?valor de mercado':
          output.market_value = formatedValue
          break

        case '?valor da firma':
          output.firm_value = formatedValue
          break

        case '?últ balanço processado':
          output.last_balance = value
          break

        case '?nro. ações':
          output.asset_count = formatedValue
          break
      }
    }
  })

  return output
}

module.exports = fundamentus
