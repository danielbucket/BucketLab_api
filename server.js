const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3648
const auth_router = require('./Auth/auth_router.js')
const bucketlab_router = require('./BucketLab/bucketlab_router.js')

if (process.env.NODE_ENV) {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackConfig = require('./webpack.common.js')()
  const compiler = webpack(webpackConfig)
  app.use(webpackDevMiddleware(compiler, ({
      publicPath: webpackConfig.output.publicPath
    })
  ))
}

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('dist'))

app.get('/bucketlab/webui', (req, res) => {
  res.sendFile(path.resolve(__dirname, '/dist/index.html'))
})

// app.use('/bucketlab/v1', bucketlab_router)
// app.use('/bucketlab/login', auth_router)

app.listen(app, PORT, () => {
  console.log(`BucketLab Server is spinning out on port ${PORT}`)
})