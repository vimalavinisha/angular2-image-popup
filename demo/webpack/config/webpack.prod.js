/*
 * MIT License
 *
 * Copyright (c) 2017 Stefano Cappa
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const webpack                 = require('webpack');
const DefinePlugin            = require('webpack/lib/DefinePlugin');
const UglifyJsPlugin          = require('webpack/lib/optimize/UglifyJsPlugin');

const WebpackMd5HashPlugin    = require('webpack-md5-hash');
const CompressionPlugin       = require('compression-webpack-plugin');
const webpackMerge            = require('webpack-merge');
const ExtractTextPlugin       = require('extract-text-webpack-plugin');
const OptimizeJsPlugin        = require('optimize-js-plugin');
const LoaderOptionsPlugin     = require('webpack/lib/LoaderOptionsPlugin');

const commonConfig            = require('./webpack.common.js');
const helpers                 = require('./helpers');

const ENV = process.env.NODE_ENV = 'production';
const METADATA = {env: ENV};

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',
  output: {
    path: helpers.root('dist'),
    filename: '[name].[chunkhash].js',
    sourceMapFilename: '[name].[chunkhash].map',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: './'
  },
  module: {
    rules: [

      /*
       * Extract CSS files from .src/styles directory to external CSS file
       */
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        }),
        include: [helpers.root('src', 'styles')]
      },

      /*
       * Extract and compile SCSS files from .src/styles directory to external CSS file
       */
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!sass-loader'
        }),
        include: [helpers.root('src', 'styles')]
      },

    ]
  },
  plugins: [
    new OptimizeJsPlugin({
      sourceMap: false
    }),
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
      allChunks: true
    }),
    new DefinePlugin({'webpack': {'ENV': JSON.stringify(METADATA.env)}}),
    new WebpackMd5HashPlugin(),
    new CompressionPlugin({regExp: /\.css$|\.html$|\.js$|\.map$/}),
    new UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8 : true
      },
      output: {
        comments: false
      },
      compress: {
        screw_ie8: true,
        warnings: false,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        negate_iife: false // we need this for lazy v8
      }
    }),
    new LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      options: {
        /**
         * Html loader advanced options
         *
         * See: https://github.com/webpack/html-loader#advanced-options
         */
        // TODO: Need to workaround Angular 2's html syntax => #id [bind] (event) *ngFor
        // htmlLoader: {
        //   minimize: true,
        //   removeAttributeQuotes: false,
        //   caseSensitive: true,
        //   customAttrSurround: [
        //     [/#/, /(?:)/],
        //     [/\*/, /(?:)/],
        //     [/\[?\(?/, /(?:)/]
        //   ],
        //   customAttrAssign: [/\)?\]?=/]
        // },
      }
    }),

  ],
  node: {
    global: true,
    crypto: 'empty',
    process: false,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
});
