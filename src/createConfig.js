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

  // omit properties that can break things
  // context is omitted becouse we already assigned the parent context as the defaults in createSettings
  // plugins are ommited by default too. It's not ideal, but it's better to let the user make a conscious choice about it.
  return merge(omit(config, 'context',  'plugins', 'entry', 'output'), {
    plugins
  });
};

const mapParentConfig = (settings, rawParentConfig) => {
  const parentConfig = prepare(rawParentConfig);
  let _originalParentConfig;

  if (settings.debug) {
    _originalParentConfig = cloneDeep(parentConfig);
  }
  
  // The user can control what to inherit from the parent config
  // by passing a fucntion to inherit the user can take only the properties he wants.
  // At this stage, inherit is always a function. regardless of what the user set "inherit" to be.
  // it created by createSettings.
  var mapFn = settings.inherit;
  const mappedParentConfig = mapFn(safeClone(parentConfig));

  if (settings.debug && !isEqual(parentConfig, _originalParentConfig)) {
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
    context: settings.context,
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
    // The user is not allowed to change output.path
    // otherwise bad things will happen.
    // (this is the path for the cache)
    output: {
      path: outputPath
    }
  };

  return webpackMerge(parentConfig, ownConfig, advanceConfig, cacheConfig);
};

export default _createConfig(cacheDir);
