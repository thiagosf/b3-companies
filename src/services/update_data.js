const cache = require('../cache')
const b3codes = require('../b3codes')
const b3company = require('../b3company')
const b3quote = require('../b3quote')
const fundamentus = require('../fundamentus')

const updateData = async () => {
  try {
    const codes = await cache.fetch({
      key: 'COMPANIES',
      options: {
        lifetime: 60 * 60 * 24
      },
      fn: async () => {
        return b3codes()
      }
    })

    let data = []

    for (let i in codes) {
      const code = codes[i]
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
    }

    for (let i in data) {
      let item = data[i]
      item.aggregate = []

      if (item.codes) {
        for (let j in item.codes) {
          const code = item.codes[j]
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
                lifetime: 120
              },
              fn: async () => {
                return b3quote(code)
              }
            })
          } catch (error) {
            console.log('quote error', code, error.message)
          }

          item.aggregate.push({
            code,
            fundamentus: fundamentusData,
            quote: quoteData
          })
        }
      }

      data[i] = item
    }
  } catch (error) {
    console.log('updateData error', error.message)
  }
}

module.exports = updateData
