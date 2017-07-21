import { strategy } from 'webpack-merge';
import { DllPlugin } from 'webpack';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import reject from 'lodash/reject';
import omit from 'lodash/omit';
import get from 'lodash/get';
import path from 'path';

import { cacheDir } from './paths';
import { merge, safeClone } from './utils';

const prepare = config => {
  var plugins = reject(
    config.plugins,
    plugin => get(plugin, 'constructor.name') === 'AutoDLLPlugin'
  );

  return merge(omit(config, 'entry', 'output', 'plugins'), { plugins });
};

const mapParentConfig = (settings, rawParentConfig) => {
  const parentConfig = prepare(rawParentConfig);
  let originalParentConfig;

  if (settings.debug) {
    originalParentConfig = cloneDeep(parentConfig);
  }

  const mappedParentConfig = settings.inherit(safeClone(parentConfig));

  if (settings.debug && !isEqual(parentConfig, originalParentConfig)) {
    throw new Error('Do not modify the original config');
  }

  return mappedParentConfig;
};

const webpackMerge = strategy({
  entry: 'replace',
  output: 'append',
  plugins: 'append'
});

export const _createConfig = cacheDir => (settings, rawParentConfig) => {
  const { hash, filename = [] } = settings;
  const outputPath = path.join(cacheDir, hash);

  const parentConfig = mapParentConfig(settings, rawParentConfig);

  const ownConfig = {
    entry: settings.entry,
    plugins: [
      new DllPlugin({
        path: path.join(outputPath, '[name].manifest.json'),
        name: '[name]_[hash]'
      })
    ],
    output: {
      filename: filename,
      library: '[name]_[hash]'
    }
  };

  const advanceConfig = settings.config;

  const cacheConfig = {
    output: {
      path: path.join(outputPath),
      publicPath: ''
    }
  };

  return webpackMerge(parentConfig, ownConfig, advanceConfig, cacheConfig);
};

export default _createConfig(cacheDir);
