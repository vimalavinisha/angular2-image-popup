'use strict';

const webpack                      = require('webpack');
const DefinePlugin                 = require('webpack/lib/DefinePlugin');
const ProvidePlugin                = require('webpack/lib/ProvidePlugin');
const CommonsChunkPlugin           = require('webpack/lib/optimize/CommonsChunkPlugin');
const LoaderOptionsPlugin          = require('webpack/lib/LoaderOptionsPlugin');
const ContextReplacementPlugin     = require('webpack/lib/ContextReplacementPlugin');
const CopyWebpackPlugin            = require('copy-webpack-plugin');
const NamedModulesPlugin           = require('webpack/lib/NamedModulesPlugin');

const HtmlWebpackPlugin            = require('html-webpack-plugin');
const ExtractTextPlugin            = require('extract-text-webpack-plugin');
const ManifestPlugin               = require('webpack-manifest-plugin');
const InlineManifestWebpackPlugin  = require('inline-manifest-webpack-plugin');
const autoprefixer                 = require('autoprefixer');
const ChunkManifestPlugin          = require('chunk-manifest-webpack-plugin');
const ngcWebpack                   = require('ngc-webpack');

const helpers                      = require('./helpers');
const TITLE                        = 'My MEAN Website';
const TEMPLATE_PATH                = './src/index.ejs';
const TEMPLATE_HTML                = 'index.html';

const AOT                          = helpers.hasNpmFlag('aot');

module.exports = {
  entry: {
    polyfills: './src/polyfills.ts',
    app: AOT ? './src/main.aot.ts' : './src/main.ts'
  },
  resolve: {
    descriptionFiles: ['package.json'],
    extensions: ['.ts', '.js', '.css', '.scss', 'json', '.html'],
    modules: [helpers.root('src'), helpers.root('node_modules')]
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.ts$/,
        loader: 'tslint-loader',
        exclude: [/\.(spec|e2e)\.ts$/, /node_modules/]
      },

      {
        test: /\.ts$/,
        use: [
          '@angularclass/hmr-loader',
          {
            loader: 'ng-router-loader',
            options: {
              loader: 'async-system',
              genDir: 'aot',
              aot: AOT
            }
          },
          'awesome-typescript-loader?{configFileName: "tsconfig-aot.json"}',
          'angular2-template-loader'
        ],
        exclude: [/\.(spec|e2e)\.ts$/]
      },


      // {
      //   test: /\.ts$/,
      //   loaders: 'awesome-typescript-loader',
      //   query: {
      //     forkChecker: true
      //   },
      //   exclude: [/\.(spec|e2e)\.ts$/]
      // },
      // {
      //   test: /\.ts$/,
      //   loaders: [
      //     'angular2-template-loader',
      //     '@angularclass/hmr-loader'
      //   ],
      //   exclude: [/\.(spec|e2e)\.ts$/]
      // },
      // {
      //   test: /\.ts$/,
      //   loaders: [
      //     'angular-router-loader' // lazy Loading
      //   ],
      //   exclude: [/\.(spec|e2e)\.ts$/]
      // },
      {
        test: /\.html$/,
        loader: 'raw-loader'
      },
      {
        test: /\.css$/,
        exclude: [helpers.root('src', 'app')],
        loader: ExtractTextPlugin
          .extract({
            fallbackLoader: "style-loader",
            loader: ['css-loader', 'postcss-loader']
          })
      },
      {
        test: /\.css$/,
        include: [helpers.root('src', 'app')],
        loader: ['raw-loader', 'postcss-loader']
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loaders: ['raw-loader', 'sass-loader']
      },
      // {
      //   test: /\.json$/,
      //   loader: 'json-loader'
      // },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      },
      // Bootstrap 4
      { test: /bootstrap\/dist\/js\/umd\//, loader: 'imports?jQuery=jquery' }
    ],
    noParse: [/node_modules\/@angular\/\*\*\/bundles\//,
      /@angular\/\*\*\/bundles\//]
  },
  plugins: [
    new NamedModulesPlugin(),
    new ManifestPlugin(),
    new InlineManifestWebpackPlugin(), // TODO check if I can remove this
    new CommonsChunkPlugin({
      name: 'polyfills',
      chunks: ['polyfills'],
      // minChunks: Infinity
    }),
    new CommonsChunkPlugin({
      name: 'vendor',
      chunks: ['app'],
      minChunks: module => /node_modules\//.test(module.resource)//|| /..\/..\/..\/..\/dist\/angular2-image-popup\//.test(module.resource)
    }),
    new CommonsChunkPlugin({
      name: ['polyfills', 'vendor'].reverse()
    }),
    new HtmlWebpackPlugin({
      title: TITLE,
      inject: true,
      // chunksSortMode: 'auto', // auto is the default value
      chunks: ['polyfills', 'vendor', 'app'],
      template: TEMPLATE_PATH,
      filename: TEMPLATE_HTML
    }),
    new ProvidePlugin({
      jQuery: 'jquery',
      jquery: 'jquery',
      $: 'jquery',
      "Tether": 'tether',
      "window.Tether": "tether",
      //---------------------------------------------------
      //------------- temporary workaround ----------------
      // https://github.com/shakacode/bootstrap-loader/issues/172#issuecomment-247205500
      //this requires exports-loader installed from npm
      Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
      Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
      Button: "exports-loader?Button!bootstrap/js/dist/button",
      Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
      Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
      Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
      Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
      Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
      Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
      Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
      Util: "exports-loader?Util!bootstrap/js/dist/util"
      //---------------------------------------------------
    }),
    new CopyWebpackPlugin([{from: './assets', to: './assets'}]),
    new ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      helpers.root('./src') // location of your src
    ),
    // TODO FIXME restore this
    // new ChunkManifestPlugin({
    //   filename: "manifest.json",
    //   manifestVariable: "webpackManifest"
    // }),
    new LoaderOptionsPlugin({
      debug: true,
      options: {
        context: __dirname,
        output: { path :  './' },
        postcss: [autoprefixer],
        tslint: {
          emitErrors: false,
          failOnHint: false,
          resourcePath: helpers.root('./src'),
          formattersDirectory: "./node_modules/tslint-loader/formatters/"
        }
      }
    }),

    new ngcWebpack.NgcWebpackPlugin({
      disabled: !AOT,
      tsConfig: helpers.root('tsconfig-aot.json'),
      resourceOverride: helpers.root('config/resource-override.js')
    })

  ],
  node: {
    global: true,
    process: true,
    Buffer: false,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false,
    clearTimeout: true,
    setTimeout: true
  }
};
