const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')
const models = require('../models')
const tvServicesData = require('../../data/tv_services.json')
let useMock = false

if (process.env.MOCK !== undefined) {
  useMock = process.env.MOCK === 'true'
}

const tvServices = async () => {
  console.time('tvCompanies')
  const { Asset } = models
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    defaultViewport: {
      width: 1280,
      height: 768
    }
  })
  let codes = []

  try {
    for (let i in tvServicesData) {
      const tvService = tvServicesData[i]
      try {
        const page = await browser.newPage()

        console.log('-- name:', tvService.name)

        // real
        if (!useMock) {
          await page.goto(tvService.url)
          await page.waitFor(2000)
          await page.screenshot({
            path: path.join(
              __dirname,
              '../../tmp',
              `_${tvService.name}.png`
            )
          })
        } else {
          const html = fs.readFileSync(
            path.join(
              __dirname,
              '../../fixtures',
              `tv_service.html`
            )
          ).toString()
          page.setContent(html)
        }

        const codeSelector = '.tv-screener__symbol'
        await page.waitForSelector(codeSelector)
        const data = await page.$$eval(codeSelector, els => {
          return [].slice.call(els).map(el => {
            const code = el.textContent.trim()
            const name = code
            const price = 0
            const open = 0
            const high = 0
            const low = 0
            const link = el.getAttribute('href')
            return { code, name, price, open, high, low, link }
          })
        })

        for (let i in data) {
          const item = data[i]
          if (!codes.includes(item.code)) {
            codes.push(item.code)
            const options = {
              where: {
                code: item.code
              },
              defaults: {
                name: item.name,
                activity: tvService.name,
                code: item.code,
                open: item.open,
                price: item.price
              }
            }
            const [asset, created] = await Asset.findOrCreate(options)
            if (!created) {
              await asset.strongUpdate(options.defaults)
            }
          }
        }

        console.log('---- items:', data.length)
      } catch (error) {
        console.log('error: ', error.message)
      }
    }
  } catch (error) {
    console.log('error: ', error.message)
  }
}

module.exports = tvServices
