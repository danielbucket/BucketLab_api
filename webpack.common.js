const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const { merge } = require('webpack-merge')

module.exports = (env) => {
  const config = env.development ? require('./webpack.dev') : require('./webpack.prod')

  return merge(config, {
    mode: env.development ? 'development' : 'production',
    entry: './WebUI/index.html',

    output: {
      filename: 'main.[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      clean: true,
    },

    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
				title: 'BucketLab',
				filename: 'index.html',
				description: 'BucketLab Server UI.',
				minify: true,
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