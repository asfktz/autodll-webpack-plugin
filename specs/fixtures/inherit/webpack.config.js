const path = require('path');
const AutoDllPlugin = require('../../../lib');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.js',
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: './src/index.html',
    }),
    new AutoDllPlugin({
      debug: true,
      filename: '[name]_[hash].js',
      path: './dll',
      inject: true,
      entry: {
        vendor: [
          'react',
          'react-dom',
          'moment'
        ]
      },

      inherit (config) {
        return config;
      },

      config: {
        entry: {
          koko: [
            'react',
            'react-dom',
            'moment'
          ]
        },

        output: {},
        plugins: [
          new UglifyJsPlugin()
        ],
        module: {}
      }
    })
  ]
};
