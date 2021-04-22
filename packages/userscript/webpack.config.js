const path = require('path')
const WebpackUserscript = require('webpack-userscript');
const dev = process.env.NODE_ENV === 'development'

module.exports = {
  mode: dev ? 'development' : 'production',
  entry: path.resolve(__dirname, 'output', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'output'),
    filename: 'kitten-scientists.user.js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist')
  },
  plugins: [
    new WebpackUserscript()
  ]
}
