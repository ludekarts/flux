var debug = process.env.NODE_ENV !== "production";
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./app/main.js",
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-2']
        }
      },
     {
       test   : /\.scss$/,
       loaders: ['style', 'css', 'postcss-loader', 'sass']
     }
    ]
  },
  postcss: [autoprefixer({
     browsers: ['last 3 versions']
  })],
  output: {
    path: __dirname,
    filename: "flux.core.js"
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};
