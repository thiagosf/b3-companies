module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('assets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      activity: {
        type: Sequelize.STRING,
        allowNull: true
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      open: {
        type: Sequelize.DECIMAL(11, 2),
        allowNull: true
      },
      price: {
        type: Sequelize.DECIMAL(11, 2),
        allowNull: true
      },
      p_l: {
        type: Sequelize.DECIMAL(11, 2),
        allowNull: true
      },
      p_vp: {
        type: Sequelize.DECIMAL(11, 2),
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM([
          'active',
          'disabled'
        ]),
        defaultValue: 'active',
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
    return queryInterface.dropTable('assets')
  }
}
