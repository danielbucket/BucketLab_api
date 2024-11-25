const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const { merge } = require('webpack-merge')

module.exports = (env = false) => {
  const config = env.production ? require('./webpack.prod') : require('./webpack.dev')
  
  return merge(config, {
    mode: env.production ? 'production' : 'development',
    entry: './WebUI/index.js',
    output: {
      filename: 'main.[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: './dist',
      clean: true,
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
				title: 'BucketLab',
				filename: 'index.html',
        template: './WebUI/index.hbs',
				description: 'BucketLab Server UI.',
				minify: true,
        type: 'module',
			})
    ],
    module: {
      rules: [
        {
          test: /\.html$/i,
          exclude: /node_modules/,
          loader: 'html-loader',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          exclude: /node_modules/,
          type: 'asset/resource',
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          exclude: /node_modules/,
          type: 'asset/resource',
        },
      ]
    },
  })
}