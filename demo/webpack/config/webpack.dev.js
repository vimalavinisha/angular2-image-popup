'use strict';

const webpack               = require('webpack');
const DefinePlugin          = require('webpack/lib/DefinePlugin');

const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');
const BrowserSyncPlugin     = require('browser-sync-webpack-plugin');
const webpackMerge          = require('webpack-merge');
const ExtractTextPlugin     = require('extract-text-webpack-plugin');

const commonConfig          = require('./webpack.common');
const helpers               = require('./helpers');

const ENV  = process.env.NODE_ENV = 'dev';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;

const METADATA = {
  env: ENV,
  host: HOST,
  portServer: '3000',
  portWebpackDevServer: PORT,
  portBrowserSync: '3300'
};

const MAIN_SERVER_PATH = `http://${METADATA.host}:${METADATA.portServer}`;
const DEV_SERVER_PATH = `http://${METADATA.host}:${METADATA.portWebpackDevServer}`;

module.exports = webpackMerge(commonConfig, {
  devServer: {
    hot: true, // MANDATORY FOR HMR
    inline: true,
    port: METADATA.portWebpackDevServer,
    historyApiFallback: true,
    stats: { colors: true },
    proxy: {
      //proxy all paths of the main
      //server (executed with gulp (not with nodemon))
      "/api/**": MAIN_SERVER_PATH
    },

  },
  devtool: 'source-map',
  output: {
    path    : helpers.root('dist'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    }),
    new DefinePlugin({'webpack': {'ENV': JSON.stringify(METADATA.env)}}),
    new BrowserSyncPlugin(
      // BrowserSync options
      {
        // browse to http://${METADATA:host}:${METADATA.portBrowserSync}/
        // during development
        host: METADATA.host,
        port: METADATA.portBrowserSync,
        // proxy the Webpack Dev Server endpoint
        // (which should be serving on DEV_SERVER_PATH) through BrowserSync
        proxy: DEV_SERVER_PATH
      },
      // plugin options
      {
        // prevent BrowserSync from reloading the page
        // and let Webpack Dev Server take care of this
        // (useful if you want to use HMR)
        reload: false
      }
    )
  ]
});
