module.exports = {
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'], // loaders are applied in reverse order, from right to left. Order matters!
      }
    ]
  },
}