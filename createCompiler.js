const path = require('path');
const { cacheDir } = require('./paths');

const createConfig = (webpack, settings) => ({
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

const compile = (webpack, dllSettings) => {
  const config = createConfig(webpack, dllSettings);
  return webpack(config);
};

module.exports = compile;
