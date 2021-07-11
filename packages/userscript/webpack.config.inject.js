/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const PnpWebpackPlugin = require("pnp-webpack-plugin");

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
  resolve: {
    extensions: [".ts", ".js"],
    plugins: [PnpWebpackPlugin],
  },
  resolveLoader: {
    plugins: [PnpWebpackPlugin.moduleLoader(module)],
  },
};
