/* eslint-disable @typescript-eslint/no-var-requires */

const isDevBuild = process.env.NODE_ENV === "development";
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const WebpackUserscript = require("webpack-userscript");

const filename = [
  "kitten-scientists",
  isDevBuild ? "-dev" : "",
  process.env.GITHUB_SHA ? `-${String(process.env.GITHUB_SHA).substring(0, 7)}` : "",
  ".user.js",
];

module.exports = {
  entry: path.resolve(__dirname, "source", "index.ts"),
  mode: isDevBuild ? "development" : "production",
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: require.resolve("ts-loader"),
      },
    ],
  },
  optimization: {
    minimize: !isDevBuild,
    minimizer: [new TerserPlugin()],
  },
  output: {
    path: path.resolve(__dirname, "bundle"),
    filename: filename.join(""),
  },
  plugins: [
    new WebpackUserscript({
      headers: {
        match: [
          "*bloodrizer.ru/games/kittens/*",
          "*kittensgame.com/alpha/*",
          "*kittensgame.com/beta/*",
          "*kittensgame.com/web/*",
          "file:///*kitten-game*",
        ],
        name: "Kitten Scientists",
      },
    }),
  ],
  resolve: {
    extensions: [".ts", ".js"],
  },
};
