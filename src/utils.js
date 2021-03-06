const fs = require('fs')
const path = require('path')
const axios = require('axios')
const torAxios = require('tor-axios')
const moment = require('moment')
const _ = require('lodash')
const puppeteer = require('puppeteer')

module.exports = {
  loadData (name) {
    let data = null
    try {
      data = fs.readFileSync(
        path.join(
          __dirname,
          '../data',
          name
        )
      ).toString()
    } catch (error) {
      console.log('error', name, error.message)
    }
    return data
  },

  writeData (name, content) {
    return fs.writeFileSync(
      path.join(
        __dirname,
        '../data',
        name
      ),
      content
    )
  },

  loadFixture (name) {
    let data = null
    try {
      data = fs.readFileSync(
        path.join(
          __dirname,
          '../fixtures',
          name
        )
      ).toString()
    } catch (error) {
      console.log('error', name, error.message)
    }
    return data
  },

  writeFixture (name, content) {
    return fs.writeFileSync(
      path.join(
        __dirname,
        '../fixtures',
        name
      ),
      content
    )
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
        port: process.env.PROXY_PORT || 9050,
        controlPort: process.env.PROXY_CONTROL_PORT || null,
        controlPassword: process.env.PROXY_CONTROL_PASSWORD || null
      })
      return tor
    }
    return axios
  },

  formatDatetime (date) {
    return moment.utc(date).format('YYYY-MM-DD HH:mm:ss')
  },

  strongParams (data, permited) {
    return _.pick(data, permited)
  },

  headlessBrowser () {
    return puppeteer.launch({
      args: [
        '--ignore-certificate-errors',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
      ],
      defaultViewport: {
        width: 1280,
        height: 768
      }
    })
  }
}
