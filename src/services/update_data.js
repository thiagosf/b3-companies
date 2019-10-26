const cache = require('../cache')
const b3codes = require('../b3codes')
const b3company = require('../b3company')
const b3quote = require('../b3quote')
const fundamentus = require('../fundamentus')
const utils = require('../utils')

const updateData = async () => {
  let data = []

  try {
    let storedData = utils.loadData('all.json')
    if (storedData) {
      storedData = JSON.parse(storedData)
    } else {
      storedData = []
    }

    if (process.env.WITH_PROXY === 'true') {
      const axios = utils.getAxios()
      await axios.torNewSession()
    }

    const codes = await cache.fetch({
      key: 'COMPANIES',
      options: {
        lifetime: 60 * 60 * 24
      },
      fn: async () => {
        return b3codes()
      }
    })

    for (let i in codes) {
      const code = codes[i]
      console.time(code)
      console.log('-- load company id:', code)
      try {
        const companyData = await cache.fetch({
          key: 'COMPANY',
          options: {
            code,
            lifetime: 60 * 60 * 24 * 30
          },
          fn: async () => {
            return b3company(code)
          }
        })
        data.push(companyData)
      } catch (error) {
        console.log('company error', code, error.message)
      }
      console.timeEnd(code)
    }

    for (let i in data) {
      let item = data[i]
      item.aggregate = []

      if (item.codes) {
        for (let j in item.codes) {
          const code = item.codes[j]

          console.time(code)
          console.log('-- update code:', code)

          let fundamentusData
          let quoteData

          try {
            fundamentusData = await cache.fetch({
              key: 'FUNDAMENTUS',
              options: {
                code,
                lifetime: 60 * 60 * 24
              },
              fn: async () => {
                return fundamentus(code)
              }
            })
          } catch (error) {
            console.log('fundamentus error', code, error.message)
          }

          try {
            quoteData = await cache.fetch({
              key: 'QUOTE',
              options: {
                code,
                lifetime: 60 * 5
              },
              fn: async () => {
                return b3quote(code)
              }
            })
          } catch (error) {
            console.log('quote error', code, error.message)
          }

          console.timeEnd(code)

          item.aggregate.push({
            code,
            fundamentus: fundamentusData,
            quote: quoteData
          })
        }
      }

      let found = false
      storedData = storedData.map(_item => {
        if (_item.id === item.id) {
          _item = { ...item }
          found = true
        }
        return _item
      })
      if (!found) {
        storedData.push(item)
      }
      utils.writeData('all.json', JSON.stringify(storedData))

      data[i] = item
    }
  } catch (error) {
    console.log('updateData error', error.message)
  }

  return data
}

module.exports = updateData
