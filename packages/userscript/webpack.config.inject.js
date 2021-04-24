const path = require('path');
const dev = process.env.NODE_ENV === 'development';
const PnpWebpackPlugin = require(`pnp-webpack-plugin`);

module.exports = {
  mode: 'development',
  devtool:"inline-source-map",
  entry: path.resolve(__dirname, 'output', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'output'),
    filename: 'kitten-scientists.inject.js'
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
