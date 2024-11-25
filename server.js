const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3648
const devMode = process.env.NODE_ENV === 'development'

const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackConfig = require('./webpack.common.js')('development')
const compiler = webpack(webpackConfig)

app.use(webpackDevMiddleware(compiler, ({
    publicPath: webpackConfig.output.publicPath
  })
))

const auth_router = require('./Auth/auth_router.js')
const bucketlab_router = require('./BucketLab/bucketlab_router.js')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/bucketlab/v1', bucketlab_router)
app.use('/bucketlab/login', auth_router)

app.listen(app, PORT, () => {
  console.log(`BucketLab Server is spinning on port ${PORT}`)
})