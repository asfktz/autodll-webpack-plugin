import test from 'tape';
import createConfig from '../src/createConfig';
import createHash from '../src/createHash';
import { cacheDir } from '../src/paths';
import path from 'path';
import webpack from 'webpack';

test('pluginSupport', t => {
  const filename = '[name].[hash].js';
  const entry = {
    vendor: ['react', 'react-dom'],
  };

  const plugins = [
    new webpack.optimize.UglifyJsPlugin({
      compress: true,
    }),
  ];
  const settings = { filename, entry, plugins };
  const hash = createHash(settings);
  const results = createConfig({ ...settings, hash });
  const outputPath = path.join(cacheDir, hash);

  const expected = {
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    entry: entry,
    output: {
      path: outputPath,
      filename: filename,
      library: '[name]_[hash]',
    },
    plugins: [
      {
        options: {
          path: path.join(outputPath, '[name].manifest.json'),
          name: '[name]_[hash]',
        },
      },
      {
        options: {
          compress: true,
        },
      },
    ],
  };

  t.deepEqual(results, expected, 'should out config currently with plugins');
  t.end();
});
