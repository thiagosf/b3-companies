const fs = require('fs')

const b3codes = async () => {
  let codes = fs.readFileSync('./data/codes.txt')
    .toString()
    .split("\n")
  if (process.env.NODE_ENV !== 'production') {
    codes = codes.slice(0, 5)
  }
  return codes
}

module.exports = b3codes
