const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const webpackDevSever = require('webpack-dev-server')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    hot: true,
  },

  // optimization.runtimeChunk: 'single' is a new feature in Webpack 5 that allows us to extract the runtime code into a separate file. This is useful for caching purposes.
  // This will create a runtime.js file in the dist folder.
  // The runtime code is the code that Webpack uses to connect the modules together at runtime.
  // This code is unique to each build and can change when the modules change.
  optimization: {
    runtimeChunk: 'single',
  },

  plugins: [
    new WebpackManifestPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
})