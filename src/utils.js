const fs = require('fs')

module.exports = {
  loadFixture (name) {
    return fs.readFileSync(`./fixtures/${name}`)
  },

  writeFixture (name, content) {
    fs.writeFileSync(`./fixtures/${name}`, content)
  },

  toDecimal (value) {
    if (value) {
      return +(
        value
          .toString()
          .replace(/\./g, '')
          .replace(/,/g, '.')
          .replace(/[^0-9\.]/g, '')
          .trim()
      )
    }
    return 0
  }
}
