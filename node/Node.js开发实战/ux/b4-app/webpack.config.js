/***
 * Excerpted from "Node.js 8 the Right Way",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/jwnode2 for more book information.
***/
// Config that includes TypeScript.
'use strict';
const path = require('path');
const distDir = path.resolve(__dirname, 'dist');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './app/index.ts',
  output: {
    filename: 'bundle.js',
    path: distDir,
  },
  devServer: {
    contentBase: distDir,
    port: 60800,
    proxy: {
      '/api': 'http://localhost:60702',
      '/es': {
        target: 'http://localhost:9200',
        pathRewrite: {'^/es' : ''},
      }
    },
  },
  module: {
    rules: [{
      test: /\.ts$/,
      loader: 'ts-loader',
    },{
      test: /\.css$/,
      use: [ 'style-loader', 'css-loader' ]
    },{
      test: /\.(png|woff|woff2|eot|ttf|svg)$/,
      loader: 'url-loader?limit=100000',
    }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Better Book Bundle Builder',
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
  ],
};

/*
// Config that includes Bootstrap CSS and JS + jQuery.
'use strict';
const path = require('path');
const distDir = path.resolve(__dirname, 'dist');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './entry.js',
  output: {
    filename: 'bundle.js',
    path: distDir,
  },
  devServer: {
    contentBase: distDir,
    port: 60800,
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [ 'style-loader', 'css-loader' ]
    },{
      test: /\.(png|woff|woff2|eot|ttf|svg)$/,
      loader: 'url-loader?limit=100000',
    }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Better Book Bundle Builder',
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
  ],
};
*/

/*
// Config that brings in Bootstrap just for styling.
'use strict';
const path = require('path');
const distDir = path.resolve(__dirname, 'dist');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './entry.js',
  output: {
    filename: 'bundle.js',
    path: distDir,
  },
  devServer: {
    contentBase: distDir,
    port: 60800,
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [ 'style-loader', 'css-loader' ]
    },{
      test: /\.(png|woff|woff2|eot|ttf|svg)$/,
      loader: 'url-loader?limit=100000',
    }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Better Book Bundle Builder',
    }),
  ],
};
*/

/*
// Config with just a basic HTML page.
'use strict';
const path = require('path');
const distDir = path.resolve(__dirname, 'dist');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './entry.js',
  output: {
    filename: 'bundle.js',
    path: distDir,
  },
  devServer: {
    contentBase: distDir,
    port: 60800,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Better Book Bundle Builder',
    }),
  ],
};
*/

/*
// Initial config.
'use strict';
module.exports = {
  entry: './entry.js',
};
*/
