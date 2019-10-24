const moment = require('moment')
const slugify = require('slugify')
const crypto = require('crypto')
const fs = require('graceful-fs')
const path = require('path')

const cache = {
  /**
   * Retorna tempo de vida do cache
   * @param {object} options
   * @returns {number}
   */
  getLifetime (options) {
    let lifetime = 60 * 5
    if (process.env.NODE_ENV !== 'production') {
      lifetime = 60 * 10
    }
    if (options && options.lifetime) {
      lifetime = options.lifetime
    }
    return lifetime
  },

  /**
   * Retorna cache
   * @param {string} prefix
   * @param {object} options
   * @returns {Promise}
   */
  get (prefix, options) {
    return new Promise((resolve, reject) => {
      try {
        let key = this._generateKey(prefix, options)
        this._log('-- cache key', key)
        if (this._hasCache(key, options)) {
          this._log('---- has cache!')
          resolve(this._readCache(key))
        } else {
          this._log('---- no cache...')
          resolve(null)
        }
      } catch (e) {
        this._log('---- cacheUtils::get error:', e)
        reject(e)
      }
    })
  },

  /**
   * Salva cache
   * @param {string} prefix
   * @param {object} options
   * @param {object} data
   * @returns {Promise}
   */
  set (prefix, options, data) {
    return new Promise((resolve, reject) => {
      try {
        let key = this._generateKey(prefix, options)
        this._writeCache(key, data)
        resolve(data)
      } catch (e) {
        this._log('---- cacheUtils::set error:', e)
        reject(e)
      }
    })
  },

  /**
   * Gera key para cache
   * @param {string} prefix
   * @param {object} obj
   * @returns {Promise}
   */
  _generateKey (prefix, obj) {
    let filter = null
    if (obj) {
      delete obj.lifetime
      try {
        filter = JSON.stringify(obj)
      } catch (e) {
        this._log('---- cacheUtils::_generateKey error:', e)
      }
    }
    let hash = crypto.createHash('md5').update(filter).digest('hex')
    let key = slugify(`${prefix}_${hash}`).toLowerCase()
    return key
  },

  /**
   * Gera path do cache
   * @param {string} key
   * @returns {string}
   */
  _generatePath (key) {
    const filename = key + '.json'
    const filepath = path.join(__dirname, '../tmp', filename)
    return filepath
  },

  /**
   * Verifica se existe cache pela key
   * @param {string} key
   * @param {object} options
   * @returns {boolean}
   */
  _hasCache (key, options = {}) {
    const filepath = this._generatePath(key)
    this._log('---- filepath', filepath)
    if (fs.existsSync(filepath)) {
      let stat = fs.statSync(filepath)
      let fileTime = moment(stat.mtimeMs)
      let minTime = moment().subtract(this.getLifetime(options), 'seconds')
      this._log('---- fileTime', fileTime.toString())
      this._log('---- minTime', minTime.toString())
      return fileTime.isAfter(minTime)
    }
    return false
  },

  /**
   * Le cache
   * @param {string} key
   * @returns {(object|null)}
   */
  _readCache (key) {
    this._log('---- reading..')
    const filepath = this._generatePath(key)
    let data = fs.readFileSync(filepath)
    return data ? JSON.parse(data) : null
  },

  /**
   * Salva cache
   * @param {string} key
   * @param {object} data
   */
  _writeCache (key, data) {
    this._log('---- writing..')
    const filepath = this._generatePath(key)
    fs.writeFileSync(filepath, JSON.stringify(data))
  },

  /**
   * Log do processo completo do cache
   */
  _log () {
    if (
      process.env.NODE_ENV === 'dev' ||
      process.env.DEBUG === 'true' ||
      parseInt(process.env.DEBUG) === 1
    ) {
      console.log(...arguments)
    }
  },

  /**
   * Resgata cache
   * @param {object} options
   * @param {string} options.key
   * @param {object} options.options
   * @param {function} options.fn Função a ser chamada
   *  se não houver cache ainda
   * @returns {Promise}
   */
  fetch (options) {
    return this.get(options.key, options.options)
      .then((result) => {
        if (!result) {
          return options.fn().then((data) => {
            return this.set(options.key, options.options, data)
          })
        }
        return result
      })
  }
}

module.exports = cache
