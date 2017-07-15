import test from 'ava';
import createConfig from '../lib/createConfig';
import createHash from '../lib/createHash';
import { cacheDir } from '../lib/paths';
import path from 'path';

test('createConfig', t => {
  const settings = {
    entry: {
      vendor: ['react', 'react-dom']
    }
  };
  const filename = '[name].[hash].js';
  const hash = createHash(settings);
  const results = createConfig({ filename, entry: settings.entry, hash });
  const outputPath = path.join(cacheDir, hash);

  const expected = {
    resolve: {
      extensions: ['.js', '.jsx']
    },
    entry: {
      vendor: ['react', 'react-dom']
    },
    output: {
      path: outputPath,
      filename: '[name].[hash].js',
      library: '[name]_[hash]'
    },
    plugins: [
      {
        options: {
          path: path.join(outputPath, '/[name].manifest.json'),
          name: '[name]_[hash]'
        }
      }
    ]
  };

  t.deepEqual(
    JSON.parse(JSON.stringify(results)),
    JSON.parse(JSON.stringify(expected)),
    'should output config currently'
  );
});
