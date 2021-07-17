/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const PnpWebpackPlugin = require("pnp-webpack-plugin");
const webpack = require("webpack");

const KG_SAVEGAME = process.env.KG_SAVEGAME ?? "./fixtures/lategame";
const KS_SETTINGS = process.env.KS_SETTINGS ?? "./fixtures/localstorage.json";

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
    new webpack.NormalModuleReplacementPlugin(/.\/fixtures\/savegame/, KG_SAVEGAME),
    new webpack.NormalModuleReplacementPlugin(/.\/fixtures\/settings/, KS_SETTINGS),
  ],
  resolve: {
    extensions: [".ts", ".js"],
    plugins: [PnpWebpackPlugin],
  },
  resolveLoader: {
    plugins: [PnpWebpackPlugin.moduleLoader(module)],
  },
};
