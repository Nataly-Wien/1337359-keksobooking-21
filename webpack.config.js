const path = require("path");

module.exports = {
  entry: [
    "./js/utils.js",
    "./js/messages.js",
    "./js/forms.js",
    "./js/backend.js",
    "./js/pins.js",
    "./js/card.js",
    "./js/filters.js",
    "./js/activation.js",
    "./js/validation.js",
    "./js/move-pin.js",
    "./js/main.js"
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname),
    iife: true
  },
  devtool: false,
  devServer: {
    open: true,
    hot: true,
    port: 8080,
  }
};
