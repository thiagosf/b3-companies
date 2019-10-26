const fs = require('fs')
const path = require('path')

const b3codes = async () => {
  let codes = fs.readFileSync(
      path.join(
        __dirname,
        '../data',
        'codes.txt'
      )
    )
    .toString()
    .split("\n")
    .filter(item => item)
  if (process.env.NODE_ENV !== 'production') {
    codes = codes.slice(0, 5)
  }
  return codes
}

module.exports = b3codes
