const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')
const models = require('../models')
const tvLinks = require('../../data/tv_indices.json')
let useMock = false

if (process.env.MOCK !== undefined) {
  useMock = process.env.MOCK === 'true'
}

const tvCompanies = async () => {
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
    for (let i in tvLinks) {
      const tvLink = tvLinks[i]
      try {
        const page = await browser.newPage()

        console.log('-- name:', tvLink.name)

        // real
        if (!useMock) {
          await page.goto(tvLink.url)
          await page.waitFor(2000)
          await page.screenshot({
            path: path.join(
              __dirname,
              '../../tmp',
              `_${tvLink.name}.png`
            )
          })
        } else {
          const html = fs.readFileSync(
            path.join(
              __dirname,
              '../../fixtures',
              `tv_${tvLink.name.toLowerCase()}.html`
            )
          ).toString()
          page.setContent(html)
        }

        const rowSelector = '.market-quotes-widget__row'
        await page.waitForSelector(rowSelector)
        const data = await page.$$eval(rowSelector, els => {
          const getContent = (el, selector, isNumber = true) => {
            const item = el.querySelector(selector)
            if (item) {
              let value = item.textContent.toString().trim()
              if (isNumber) {
                value = +value
              } else {
                value = value.replace(/\s{1,}/g, ' ').trim()
              }
              return value
            }
          }
          return [].slice.call(els).map(el => {
            let code = null
            let name = getContent(el, '.market-quotes-widget__field--name-width', false)
            let price = getContent(el, '.market-quotes-widget__field--last .market-quotes-widget__ellipsis-value')
            let open = getContent(el, '.market-quotes-widget__field--open .market-quotes-widget__ellipsis-value')
            let high = getContent(el, '.market-quotes-widget__field--high .market-quotes-widget__ellipsis-value')
            let low = getContent(el, '.market-quotes-widget__field--low .market-quotes-widget__ellipsis-value')
            let link
            const linkEl = el.querySelector('.market-quotes-widget__field--name-width a')
            if (linkEl) {
              link = linkEl.getAttribute('href')
              code = link.split(':').pop().trim()
            }
            if (code && !isNaN(+price) && +price > 0) {
              return { code, name, price, open, high, low, link }
            }
          }).filter(item => item)
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
                activity: item.activity,
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
      } catch (e) {
        console.log('error: ', tvLink.name, e)
      }
    }
  } catch (error) {
    console.log('tvCompanies error', error)
  }

  console.timeEnd('tvCompanies')

  await browser.close()
}

module.exports = tvCompanies
