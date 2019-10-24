const b3codes = require('./src/b3codes')
const b3company = require('./src/b3company')
const fundamentus = require('./src/fundamentus')

async function main() {
  const codes = await b3codes()
  let output = []
  for (let i in codes) {
    const code = codes[i]
    let data = await b3company(code)
    if (data.codes) {
      data.fundamentus = []
      await data.codes.forEach(async code => {
        data.fundamentus.push({
          code,
          fundamentus: await fundamentus(code)
        })
      })
    }
    output.push(data)
  }
  console.log(JSON.stringify(output))
}

main()
