"use strict";

var webpack = require("webpack");
const path = require("path");

module.exports = {
  // Set debugging source maps to be "inline" for
  // simplicity and ease of use
  devtool: "inline-source-map",

  // The application entrypoint
  entry: "./src/index.tsx",

  // Where to compile the bundle
  // By default the output directory is `dist`
  output: {
    filename: "bundle.js"
  },

  // Supported file loaders
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        "style-loader", // creates style nodes from JS strings
        "css-loader", // translates CSS into CommonJS
        "sass-loader" // compiles Sass to CSS, using Node Sass by default
      ]
    },
    {
      test: /\.tsx?$/,
      loader: "ts-loader"
    }
    ]
  },

  // File extensions to support resolving
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: { 'api': path.resolve(__dirname, './src/api') }
  },
  plugins: [new webpack.ProvidePlugin({
    'api': 'api'
  })]
};
