import webpack, { DllReferencePlugin } from 'webpack';
import flatMap from 'lodash/flatMap';
import isEmpty from 'lodash/isEmpty';
import once from 'lodash/once';
import { SyncHook } from 'tapable';
import { RawSource } from 'webpack-sources';

import path from 'path';

import { cacheDir, getManifestPath, getInjectPath } from './paths';
import createCompileIfNeeded from './createCompileIfNeeded';
import createConfig from './createConfig';
import createMemory from './createMemory';
import createSettings from './createSettings';
import getInstanceIndex from './getInstanceIndex';
import createHandleStats from './createHandleStats';
import createLogger from './createLogger';

class AutoDLLPlugin {
  constructor(settings) {
    // first, we store a reference to the settings passed by the user as is.
    this._originalSettings = settings;
  }

  // apply is called once when compiler initialized.
  // note that even if the it called using webpack-dev-server
  // it still called only once and not on every re-run.
  // keep in mind that some user wanted to use multiple instances of the plugin in one config,
  // in that case, each instance calls its own apply.
  apply(compiler) {
    // createSettings responsibe for extending the defaults values with the user's settings.
    // It also adds a uniqe hash which in the form of:
    // [env]_instance_[index]_[settingsHash]
    // [env] - settings.env provided by the user. defaults to NODE_ENV
    // [index] - the index of the instance in the user's plugins array.
    // [settingsHash] - a hash made of JSON.stringify(settings) with some values omitted.
    // hash example: development_instance_0_3289102229a87e84441ca34609c27500

    // both [env] & [index] aims to solve the challenge of having muliple instances.
    // in the plugin itself its not a problem,
    // but since the cache is stored in file system we need to came up with a uniqe path for each instance
    // to prevent collision. related to: https://github.com/asfktz/autodll-webpack-plugin/issues/30

    const settings = createSettings({
      originalSettings: this._originalSettings,
      index: getInstanceIndex(compiler.options.plugins, this),
      parentConfig: compiler.options,
    });

    const log = createLogger(settings.debug);
    const dllConfig = createConfig(settings, compiler.options);
    const compileIfNeeded = createCompileIfNeeded(log, settings);

    const memory = createMemory();
    const handleStats = createHandleStats(log, settings.hash, memory);

    compiler.hooks.autodllStatsRetrieved = new SyncHook(['stats', 'source']);

    if (isEmpty(dllConfig.entry)) {
      // there's nothing to do.
      return;
    }

    const { context, inject } = settings;

    const attachDllReferencePlugin = once(compiler => {
      Object.keys(dllConfig.entry)
        .map(getManifestPath(settings.hash))
        .forEach(manifestPath => {
          new DllReferencePlugin({
            context: context,
            manifest: manifestPath,
          }).apply(compiler);
        });
    });

    const beforeCompile = (params, callback) => {
      const dependencies = new Set(params.compilationDependencies);
      [...dependencies].filter(path => !path.startsWith(cacheDir));
      callback();
    };

    const watchRun = (compiler, callback) => {
      compileIfNeeded(() => webpack(dllConfig))
        .then(stats => handleStats(stats))
        .then(({ source, stats }) => {
          compiler.hooks.autodllStatsRetrieved.call(stats, source);

          if (source === 'memory') return;
          memory.sync(settings.hash, stats);
        })
        .then(() => {
          attachDllReferencePlugin(compiler);
          callback();
        })
        .catch(console.error);
    };

    const emit = (compilation, callback) => {
      const dllAssets = memory.getAssets().reduce((assets, { filename, buffer }) => {
        const assetPath = path.join(settings.path, filename);

        return {
          ...assets,
          [assetPath]: new RawSource(buffer),
        };
      }, {});

      compilation.assets = { ...compilation.assets, ...dllAssets };

      callback();
    };

    compiler.hooks.beforeCompile.tapAsync('AutoDllPlugin', beforeCompile);
    compiler.hooks.run.tapAsync('AutoDllPlugin', watchRun);
    compiler.hooks.watchRun.tapAsync('AutoDllPlugin', watchRun);
    compiler.hooks.emit.tapAsync('AutoDllPlugin', emit);

    if (inject) {
      const getDllEntriesPaths = extension =>
        flatMap(memory.getStats().entrypoints, 'assets')
          .filter(filename => filename.endsWith(extension))
          .map(filename =>
            getInjectPath({
              publicPath: settings.publicPath,
              pluginPath: settings.path,
              filename,
            })
          );

      const doCompilation = (htmlPluginData, callback) => {
        htmlPluginData.assets.js = [...getDllEntriesPaths('.js'), ...htmlPluginData.assets.js];
        htmlPluginData.assets.css = [...getDllEntriesPaths('.css'), ...htmlPluginData.assets.css];

        callback(null, htmlPluginData);
      };

      compiler.hooks.compilation.tap('AutoDllPlugin', compilation => {
        if (!compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration) {
          return;
        }

        compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync(
          'AutoDllPlugin',
          doCompilation
        );
      });
    }
  }
}

export default AutoDLLPlugin;
