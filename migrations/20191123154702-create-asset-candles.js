module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('asset_candles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      asset_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'assets',
          key: 'id'
        },
        onDelete: 'CASCADE',
      },
      time_frame: {
        type: Sequelize.STRING,
        defaultValue: '1d',
        allowNull: false
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      open: {
        type: Sequelize.DECIMAL(11, 2),
        defaultValue: 0,
        allowNull: false
      },
      high: {
        type: Sequelize.DECIMAL(11, 2),
        defaultValue: 0,
        allowNull: false
      },
      low: {
        type: Sequelize.DECIMAL(11, 2),
        defaultValue: 0,
        allowNull: false
      },
      close: {
        type: Sequelize.DECIMAL(11, 2),
        defaultValue: 0,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('asset_candles')
  }
}
