const webpack = require('webpack');
const path = require('path');
const { cacheDir } = require('./paths');

const createConfig = ({ filename, entry }) => {
  return {
    resolve: {
      extensions: ['.js', '.jsx']
    },
    entry: entry,
    output: {
      path: path.join(cacheDir, 'bundles'),
      filename: filename,
      library: '[name]_[hash]'
    },
    plugins: [
      new webpack.DllPlugin({
        path: path.join(cacheDir, '[name].manifest.json'),
        name: '[name]_[hash]'
      })
    ]
  };
};

const compile = (settings) => {
  const config = createConfig(settings);
  return webpack(config);
};

module.exports = compile;
