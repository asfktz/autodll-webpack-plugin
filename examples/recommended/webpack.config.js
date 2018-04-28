const path = require('path');
const AutoDllPlugin = require('../../lib');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: './src/index.html',
    }),
    new AutoDllPlugin({
      debug: true,
      inject: true,
      filename: '[name]_[hash].js',
      path: './dll',
      entry: {
        vendor: ['react', 'react-dom'],
      },
    }),
  ],
};
