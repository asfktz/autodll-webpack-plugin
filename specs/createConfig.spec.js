import test from 'tape';
import createConfig from '../src/createConfig';
import createHash from '../src/createHash';
import { cacheDir } from '../src/paths';
import path from 'path';

test('createConfig', t => {
  const settings = {
    entry: {
      vendor: ['react', 'react-dom'],
    },
  };
  const filename = '[name].[hash].js';
  const hash = createHash(settings);
  const results = createConfig({ filename, entry: settings.entry, hash });
  const outputPath = path.join(cacheDir, hash);

  const expected = {
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    entry: settings.entry,
    output: {
      path: outputPath,
      filename: filename,
      library: '[name]_[hash]',
    },
    plugins: [
      {
        options: {
          path: path.join(cacheDir, hash, '/[name].manifest.json'),
          name: '[name]_[hash]',
        },
      },
    ],
  };

  t.deepEqual(results, expected, 'should out config currently');
  t.end();
});
