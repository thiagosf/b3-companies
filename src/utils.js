const fs = require('fs')
const axios = require('axios')
const torAxios = require('tor-axios')

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
          .replace(/[^0-9\.\-]/g, '')
          .trim()
      )
    }
    return 0
  },

  getAxios () {
    if (process.env.WITH_PROXY === 'true') {
      const tor = torAxios.torSetup({
        ip: process.env.PROXY_HOST || 'localhost',
        port: process.env.PROXY_PORT || 9050
      })
      console.log(tor)
      return tor
    }
    return axios
  }
}
