const express = require('express')
const cors = require('cors')
const schedule = require('node-schedule')
const routes = require('./routes')
const services = require('./services')

const app = express()
const port = +(process.env.PORT || 4000)

schedule.scheduleJob('*/5 10-17 * * 1,2,3,4,5', () => {
// schedule.scheduleJob('* * * * *', () => {
  return services.updateQuote()
})

app.use(cors())
app.get('/companies', routes.companies)

app.use((err, req, res, next) => {
  const isDev = (
    process.env.NODE_ENV === 'dev' ||
    process.env.NODE_ENV === 'development'
  )
  if (isDev) {
    console.log(err)
  }
  let statusCode = 200
  let message = err.message
  if (err) {
    if (err.status) {
      statusCode = err.status
    }
    if (err.errors) {
      message = err.errors.map(i => res.__(i.message)).join(', ')
      err.status = 422
    }
  }
  res.status(statusCode)
  res.send({
    success: false,
    message
  })
})

app.listen(port, () => {
  console.log(`Express listening on port ${port}!`)
})
