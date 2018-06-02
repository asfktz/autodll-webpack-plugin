const AutoDllPlugin = require('../../lib');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'production',
  plugins: [
    new AutoDllPlugin({
      debug: true,
      filename: '[name].dll.js',
      entry: {
        vendor: ['react', 'react-dom'],
      },
      plugins: [new UglifyJsPlugin()],
    }),
  ],
};
