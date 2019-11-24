require('dotenv').config()

module.exports = {
  dialect: 'mysql',
  migrationStorageTableName: 'sequelize_data',
  url: process.env.DATABASE_URL,
  modelsPath: 'src/models',
  seedersPath: 'seeders'
}
