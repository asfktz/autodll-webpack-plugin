import webpack from 'webpack';
import path from 'path';
import { cacheDir } from './paths';

export const _createConfig = (cacheDir) => ({ hash, filename, entry, plugins: userPlugins = [], module = {} }) => {
  const outputPath = path.join(cacheDir, hash);

  const plugins = [
    new webpack.DllPlugin({
      path: path.join(outputPath, '[name].manifest.json'),
      name: '[name]_[hash]'
    })
  ];

  return {
    resolve: {
      extensions: ['.js', '.jsx']
    },
    entry: entry,
    output: {
      path: path.join(outputPath),
      filename: filename,
      library: '[name]_[hash]'
    },
    module: module,
    plugins: plugins.concat(userPlugins)
  };
};

export default _createConfig(cacheDir);
