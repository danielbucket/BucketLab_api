const express = require('express')
const app = express()
const PORT = process.env.PORT || 3648

const auth_router = require('./Auth/auth_router.js')
const bucketlab_router = require('./BucketLab/bucketlab_router.js')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/bucketlab/v1', bucketlab_router)
app.use('/api/authrouter', auth_router)

app.listen(app, PORT, () => {
  console.log(`BucketLab Server is spinning on port ${PORT}`)
})