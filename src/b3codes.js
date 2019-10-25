const fs = require('fs')

const b3codes = async () => {
  const codes = fs.readFileSync('../data/codes.txt')
    .toString()
    .split("\n")
  if (process.env.NODE_ENV !== 'production') {
    codes = codes.split(0, 5)
  }
  return codes
}

module.exports = b3codes
