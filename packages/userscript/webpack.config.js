const path = require('path');
const WebpackUserscript = require('webpack-userscript');
const dev = process.env.NODE_ENV === 'development';
const PnpWebpackPlugin = require(`pnp-webpack-plugin`);

module.exports = {
  mode: dev ? 'development' : 'production',
  entry: path.resolve(__dirname, 'output', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'output'),
    filename: 'kitten-scientists.user.js'
  },
  optimization: {
    minimize: false
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist')
  },
  plugins: [
    new WebpackUserscript()
  ],
  resolve: {
    plugins: [
      PnpWebpackPlugin,
    ],
  },
  resolveLoader: {
    plugins: [
      PnpWebpackPlugin.moduleLoader(module),
    ],
  },
}
