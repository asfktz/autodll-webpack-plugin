import webpack from 'webpack';
import path from 'path';
import { cacheDir } from './paths';

const createConfig = ({ filename, entry, plugins, hash }) => {
  const outputPath = path.join(...[cacheDir, hash].filter(Boolean));
  plugins = plugins || [];

  return {
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    entry: entry,
    output: {
      path: path.join(outputPath),
      filename: filename,
      library: '[name]_[hash]',
    },
    plugins: [
      new webpack.DllPlugin({
        path: path.join(outputPath, '[name].manifest.json'),
        name: '[name]_[hash]',
      }),
    ].concat(plugins),
  };
};

export default createConfig;
