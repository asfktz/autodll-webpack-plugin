const path = require('path');
const AutoDllPlugin = require('../../lib');

module.exports = {
  entry: {
    app: './src/index.js',
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },

  plugins: [
    new AutoDllPlugin({
      debug: true,
      filename: '[name].dll.js',
      entry: {
        vendor: ['react', 'react-dom'],
      },
    }),
  ],
};
