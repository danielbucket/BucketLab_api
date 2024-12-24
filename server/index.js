require('dotenv').config()

const server = require('./src/server')
const PORT = process.env.PORT || 4020

server.listen(PORT, () => {
  console.log(`BucketLab Server is running on port: ${PORT}`)
})