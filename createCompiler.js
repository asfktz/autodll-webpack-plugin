const webpack = require('webpack');
const path = require('path');
const { cacheDir } = require('./paths');

const createConfig = (settings) => ({
  resolve: {
    extensions: ['.js', '.jsx']
  },
  entry: settings.entry,
  output: {
    path: cacheDir,
    filename: '[name].bundle.js',
    library: '[name]_[hash]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(cacheDir, '[name].manifest.json'),
      name: '[name]_[hash]'
    })
  ]
});

const compile = (dllSettings) => {
  const config = createConfig(dllSettings);
  return webpack(config);
};

module.exports = compile;
