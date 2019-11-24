const utils = require('../utils')

module.exports = (sequelize, DataTypes) => {
  let Asset

  /**
   * AssetCandle
   * @class
   */
  const AssetCandle = sequelize.define('AssetCandle', {
    asset_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'assets',
        key: 'id'
      },
      onDelete: 'CASCADE',
    },
    time_frame: {
      type: DataTypes.STRING,
      defaultValue: '1d',
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    open: {
      type: DataTypes.DECIMAL(11, 2),
      defaultValue: 0,
      allowNull: false
    },
    high: {
      type: DataTypes.DECIMAL(11, 2),
      defaultValue: 0,
      allowNull: false
    },
    low: {
      type: DataTypes.DECIMAL(11, 2),
      defaultValue: 0,
      allowNull: false
    },
    close: {
      type: DataTypes.DECIMAL(11, 2),
      defaultValue: 0,
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
    tableName: 'asset_candles'
  })

  /**
   * Associa models
   * @param {object} models Models
   */
  AssetCandle.associate = function (models) {
    Asset = models.Asset
    AssetCandle.belongsTo(Asset, {
      as: 'asset'
    })
  }

  /**
   * Dados públicos
   * @returns {Promise}
   */
  AssetCandle.prototype.publicData = function () {
    let promises = []
    let output = {
      id: this.id,
      asset_id: this.asset_id,
      time_frame: this.time_frame,
      date: this.date,
      open: this.open,
      high: this.high,
      low: this.low,
      close: this.close,
      created_at: utils.formatDatetime(this.created_at),
      updated_at: utils.formatDatetime(this.updated_at)
    }
    if (this.asset) {
      promises.push(
        this.asset.publicData().then(data => {
          output.asset = data
        })
      )
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
  AssetCandle.prototype.strongUpdate = function (data) {
    data = utils.strongParams(data, [
      'asset_id',
      'time_frame',
      'date',
      'open',
      'high',
      'low',
      'close'
    ])
    return this.update(data)
  }

  /**
   * Cria usuário com strong params
   * @param {object} data Dados
   * @returns {Promise}
   */
  AssetCandle.strongCreate = function (data) {
    data = utils.strongParams(data, [
      'asset_id',
      'time_frame',
      'date',
      'open',
      'high',
      'low',
      'close'
    ])
    return AssetCandle.create(data)
  }

  return AssetCandle
}
