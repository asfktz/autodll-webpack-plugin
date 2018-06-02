const AutoDllPlugin = require('../../lib');

module.exports = {
  mode: 'development',
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
