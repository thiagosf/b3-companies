const path = require('path')
const fs = require('fs')
const utils = require('./utils')

const createDirectoryIfNotExists = dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true
    })
  }
}

const screenshot = async (code, interval = 'D') => {
  let output = false
  console.log('-- screenshot:', code, new Date())
  console.time(code)

  const browser = await utils.headlessBrowser()
  const page = await browser.newPage()

  try {
    const hideElement = async name => {
      await page.evaluate((value) => {
        const el = document.querySelector(value)
        if (el) {
          el.style.display = 'none'
        }
      }, name)
    }
    const upIndex = el => el.style.zIndex = '10000'

    const cookies = process.env.TV_COOKIES ? JSON.parse(process.env.TV_COOKIES) : []
    await page.setCookie(...cookies)
    await page.goto(`https://br.tradingview.com/chart/?symbol=BMFBOVESPA:${code}&interval=${interval}`)
    await page.waitFor(10)

    const zoomSelector = '.control-bar__btn--zoom-in'
    await page.waitForSelector(zoomSelector, { timeout: 7000 })
    const clicks = 3
    for (let i = 0; i < clicks; i++) {
      await page.click(zoomSelector)
    }

    const allContent = '.js-rootresizer__contents'
    await page.$eval(allContent, upIndex)

    await hideElement('.control-bar-wrapper')
    await hideElement('#overlap-manager-root')
    await hideElement('div[data-role="toast-container"]')

    const chartSelector = '.layout__area--center'
    const rect = await page.evaluate(selector => {
      const element = document.querySelector(selector)
      if (!element)
        return null
      const { x, y, width, height } = element.getBoundingClientRect()
      return { left: x, top: y, width, height, id: element.id }
    }, chartSelector)

    if (rect) {
      const chartsPath = path.join(
        __dirname,
        '../public/files/charts',
      )
      createDirectoryIfNotExists(chartsPath)
      let name = `${code}.png`
      if (interval !== 'D') {
        name = `${code}_${interval}.png`
      }
      await page.screenshot({
        path: path.join(
          chartsPath,
          name
        ),
        clip: {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height
        }
      })
      output = true
    }
  } catch (error) {
    console.log('screenshot error:', code, error)
  } finally {
    await page.close()
    await browser.close()
  }

  console.timeEnd(code)
  return output
}

module.exports = screenshot
