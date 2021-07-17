/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const PnpWebpackPlugin = require("pnp-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  devtool: "inline-source-map",
  entry: path.resolve(__dirname, "source", "index.ts"),
  mode: "development",
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: require.resolve("ts-loader"),
        options: PnpWebpackPlugin.tsLoaderOptions(),
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "output"),
    filename: "kitten-scientists.inject.js",
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/.\/fixtures\/savegame/, "./fixtures/lategame"),
    new webpack.NormalModuleReplacementPlugin(
      /.\/fixtures\/settings/,
      "./fixtures/localstorage.json"
    ),
  ],
  resolve: {
    extensions: [".ts", ".js"],
    plugins: [PnpWebpackPlugin],
  },
  resolveLoader: {
    plugins: [PnpWebpackPlugin.moduleLoader(module)],
  },
};
