'use strict';

const webpack = require('webpack');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

const WebpackMd5HashPlugin = require('webpack-md5-hash');
const CompressionPlugin = require('compression-webpack-plugin');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');

const ENV = process.env.NODE_ENV = 'production';
const METADATA = {env: ENV};

// GITHUB => use deploy config for github
const GITHUB = helpers.hasNpmFlag('github');

console.log(`isGithub: ${GITHUB}`);

module.exports = webpackMerge(commonConfig, {
  output: {
    path:  GITHUB ? '../../docs' : helpers.root('dist'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: GITHUB ? '/angular-modal-gallery/' : '/'
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    }),
    new WebpackMd5HashPlugin(),

    new CompressionPlugin({regExp: /\.css$|\.html$|\.js$|\.map$/}),
    // new CopyWebpackPlugin([{from: './src/index.html', to: 'index.html'}]),

    new DefinePlugin({'webpack': {'ENV': JSON.stringify(METADATA.env)}}),

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
        join_vars: true
        // negate_iife: false // we need this for lazy v8
      }
    })
  ]
});
