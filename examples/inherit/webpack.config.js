const path = require('path');
const AutoDllPlugin = require('../../lib');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.js',
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
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

      invalidate (state, config, hash) {
        hash = hash.add('....');
        
        return Promise.resolve()
          .then(() => {
            hash = hash.add('....');

            return hash;
          });
      },

      inherit (config) {
        return config;
      },

      config: {
        output: {
          library: 'yaboo',
          libraryTarget: 'umd',
          path: 'boooom',
          publicPath: 'bsssss'
        },
        plugins: [
          new UglifyJsPlugin()
        ],
        module: {}
      }
    })
  ]
};
