const utils = require('../utils')

module.exports = (sequelize, DataTypes) => {
  let AssetCandle

  /**
   * Asset
   * @class
   */
  const Asset = sequelize.define('Asset', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    activity: {
      type: DataTypes.STRING,
      allowNull: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    open: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: true
    },
    p_l: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: true
    },
    p_vp: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM([
        'active',
        'disabled'
      ]),
      defaultValue: 'active',
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    underscored: true,
    underscoredAll: true,
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    tableName: 'assets',
    scopes: {
      active: {
        where: {
          status: 'active'
        }
      }
    }
  })

  /**
   * Associa models
   * @param {object} models Models
   */
  Asset.associate = function (models) {
    AssetCandle = models.AssetCandle
    Asset.hasMany(AssetCandle, {
      as: 'asset_candles'
    })
  }

  /**
   * Dados públicos
   * @returns {Promise}
   */
  Asset.prototype.publicData = function () {
    let promises = []
    let output = {
      id: this.id,
      name: this.name,
      activity: this.activity,
      code: this.code,
      open: this.open,
      price: this.price,
      p_l: this.p_l,
      p_vp: this.p_vp,
      created_at: utils.formatDatetime(this.created_at),
      updated_at: utils.formatDatetime(this.updated_at)
    }
    if (this.asset_candles) {
      output.candles = []
      this.asset_candles.map(item => {
        promises.push(
          item.publicData().then(data => {
            output.candles.push(data)
          })
        )
      })
    }
    return Promise.all(promises).then(() => {
      return output
    })
  }

  /**
   * Atualiza usuário com strong params
   * @param {object} data Dados para atualizar
   * @returns {Promise}
   */
  Asset.prototype.strongUpdate = function (data) {
    data = utils.strongParams(data, [
      'name',
      'activity',
      'code',
      'open',
      'price',
      'p_l',
      'p_vp',
      'status'
    ])
    return this.update(data)
  }

  /**
   * Cria usuário com strong params
   * @param {object} data Dados
   * @returns {Promise}
   */
  Asset.strongCreate = function (data) {
    data = utils.strongParams(data, [
      'name',
      'activity',
      'code',
      'open',
      'price',
      'p_l',
      'p_vp',
      'status'
    ])
    return Asset.create(data)
  }

  return Asset
}
