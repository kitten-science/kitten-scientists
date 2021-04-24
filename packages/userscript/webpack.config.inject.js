const path = require('path');
const dev = process.env.NODE_ENV === 'development';
const PnpWebpackPlugin = require(`pnp-webpack-plugin`);

module.exports = {
  mode: dev ? 'development' : 'production',
  entry: path.resolve(__dirname, 'output', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'output'),
    filename: 'kitten-scientists.inject.js'
  },
  optimization: {
    minimize: false
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist')
  },
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
