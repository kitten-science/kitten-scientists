const path = require("path");
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
  },
};
