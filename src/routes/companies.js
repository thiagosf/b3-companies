const cache = require('../cache')

const companies = async (req, res, next) => {
  try {
    const lifetime = 60 * 60 * 24 * 30
    const codes = await cache.fetch({
      key: 'COMPANIES',
      options: { lifetime },
      fn: async () => {
        return null
      }
    })

    let data = []

    for (let i in codes) {
      const code = codes[i]
      try {
        const companyData = await cache.fetch({
          key: 'COMPANY',
          options: { code, lifetime }
        })
        data.push(companyData)
      } catch (error) {
        console.log('company error', code, error.message)
      }
    }

    for (let i in data) {
      let item = data[i]
      if (item) {
        item.aggregate = []

        if (item.codes) {
          for (let j in item.codes) {
            const code = item.codes[j]
            let fundamentusData
            let quoteData

            try {
              fundamentusData = await cache.fetch({
                key: 'FUNDAMENTUS',
                options: { code, lifetime }
              })
            } catch (error) {
              console.log('fundamentus error', code, error.message)
            }

            try {
              quoteData = await cache.fetch({
                key: 'QUOTE',
                options: { code, lifetime }
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
    }

    data = data.filter(item => !!item)

    res.send({
      success: true,
      data
    })
  } catch (error) {
    next(error)
  }
}

module.exports = companies
