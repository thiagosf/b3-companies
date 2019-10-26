const updateData = require('./services/update_data')

async function main() {
  const data = await updateData()
  console.log(JSON.stringify(data))
}

main()
