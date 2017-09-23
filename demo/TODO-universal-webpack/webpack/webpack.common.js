const { root } = require('./helpers');

/**
 * This is a common webpack config which is the base for all builds
 */
module.exports = {
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    path: root('dist')
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: '@ngtools/webpack'
          },
          {
            loader: 'awesome-typescript-loader',
            options: {
              configFileName: '${TS_CONFIG}'
            }
          },
          {
            loader: 'angular2-template-loader'
          }
        ],
        exclude: [/\.(spec|e2e)\.ts$/]
      },

      { test: /\.css$/, loader: 'raw-loader' },
      { test: /\.html$/, loader: 'raw-loader' },
      {
        test: /\.css$/,
        use: ['to-string-loader', 'css-loader'],
        exclude: [root('src')]
      },
      {
        test: /\.scss$/,
        use: ['to-string-loader', 'css-loader', 'sass-loader'],
        exclude: [root('src')]
      },
    ]
  },
  plugins: [
  ]
};
