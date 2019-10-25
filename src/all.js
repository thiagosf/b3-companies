const b3codes = require('./b3codes')
const b3company = require('./b3company')
const b3quote = require('./b3quote')
const fundamentus = require('./fundamentus')

async function main() {
  const codes = await b3codes()
  let output = []
  for (let i in codes) {
    const code = codes[i]
    console.log('-- code:', code)
    console.log('---- init:', new Date())
    try {
      let data = await b3company(code, 5000)
      if (data.codes) {
        data.aggregate = []
        for (let i in data.codes) {
          const code = data.codes[i]
          data.aggregate.push({
            code,
            fundamentus: await fundamentus(code),
            quote: await b3quote(code)
          })
        }
      }
      output.push(data)
    } catch (error) {
      output.push({
        code,
        error: error.message
      })
    }
    console.log('---- end:', new Date())
  }
  console.log(JSON.stringify(output))
}

main()
