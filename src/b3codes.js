const fs = require('fs')

const b3codes = async () => {
  const codes = fs.readFileSync('./data/codes.txt')
    .toString()
    .split("\n")
  return codes
}

module.exports = b3codes
