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
    const hideElement = el => el.style.display = 'none'
    await page.goto(`https://br.tradingview.com/chart/?symbol=BMFBOVESPA:${code}&interval=${interval}`)
    await page.waitFor(10)

    const zoomSelector = '.control-bar__btn--zoom-in'
    await page.waitForSelector(zoomSelector, { timeout: 7000 })
    const clicks = 3
    for (let i = 0; i < clicks; i++) {
      await page.click(zoomSelector)
    }

    const controlSelector = '.control-bar-wrapper'
    await page.$eval(controlSelector, hideElement)

    const tvSelector = '.tv-floating-toolbar'
    await page.$eval(tvSelector, hideElement)

    const overlay = '#overlap-manager-root'
    await page.$eval(overlay, hideElement)

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
      await page.screenshot({
        path: path.join(
          chartsPath,
          `${code}.png`
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
