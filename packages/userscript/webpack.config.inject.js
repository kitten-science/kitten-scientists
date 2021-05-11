/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const PnpWebpackPlugin = require("pnp-webpack-plugin");

module.exports = {
  mode: 'development',
  devtool: "inline-source-map",
  entry: path.resolve(__dirname, 'source', 'index.ts'),
  output: {
    path: path.resolve(__dirname, 'output'),
    filename: 'kitten-scientists.inject.js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: require.resolve("ts-loader"),
        options: PnpWebpackPlugin.tsLoaderOptions(),
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"],
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
