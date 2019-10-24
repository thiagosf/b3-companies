const assert = require('assert')
const b3quote = require('../src/b3quote')

describe('b3quote', () => {
  it('should get quote data', async () => {
    const code = 'MGLU3'
    const data = await b3quote(code)
    assert(data.hasOwnProperty('open'), 'open')
    assert(data.hasOwnProperty('max'), 'max')
    assert(data.hasOwnProperty('min'), 'min')
    assert(data.hasOwnProperty('average'), 'average')
    assert(data.hasOwnProperty('current'), 'current')
    assert(data.hasOwnProperty('variation'), 'variation')
  })
})
