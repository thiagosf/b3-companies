const assert = require('assert')
const utils = require('../src/utils')

describe('utils', () => {
  describe('toDecimal', () => {
    it('should convert large number', () => {
      const value = '663.238.000'
      const expected = 663238000.00
      assert.equal(utils.toDecimal(value), expected)
    })

    it('should convert money', () => {
      const value = 'R$0,57'
      const expected = 0.57
      assert.equal(utils.toDecimal(value), expected)
    })

    it('should convert percentage', () => {
      const value = '12,5%'
      const expected = 12.5
      assert.equal(utils.toDecimal(value), expected)
    })

    it('should keep minus signal', () => {
      const value = '-12,5%'
      const expected = -12.5
      assert.equal(utils.toDecimal(value), expected)
    })
  })
})
