import { tapLog, log } from './utils/log';
import compileIfNeeded from './compileIfNeeded';
import createCompiler from './createCompiler';
import { getManifestPath, cacheDir } from './paths';
import { DllReferencePlugin } from 'webpack';
import { concat, merge, keys } from './utils/index.js';
import path from 'path';

import createMemory from './createMemory';

class Plugin {
  constructor(options) {
    this.options = merge({
      context: __dirname,
      path: '',
      entry: {},
      filename: '[name].dll.js',
      inject: false
    }, options);
  }

  onRun (compiler, callback) {
    const { entry } = this.options;

    return compileIfNeeded(entry, () => createCompiler(this.options))
      .then(tapLog('initialized!', 1))
      .then(() => {
        return createMemory().then((memory) => {
          this.initialized = true;
          this.memory = memory;
        });
      })    
      .then(tapLog('dll created!'))
      .then(() => callback());
  }

  apply(compiler) {
    const { context, inject, entry, path: outputPath } = this.options;

    const publicPath = (filename) => path.join(outputPath, filename);

    keys(entry).map(getManifestPath)
      .forEach(manifestPath => {
        new DllReferencePlugin({ context: context, manifest: manifestPath })
          .apply(compiler);
      });

    compiler.plugin('before-compile', (params, callback) => {
      params.compilationDependencies = params.compilationDependencies
        .filter((path) => !path.startsWith(cacheDir));

      callback();
    });

    compiler.plugin('watch-run', this.onRun.bind(this));
    compiler.plugin('run', this.onRun.bind(this));

    compiler.plugin('emit', (compilation, callback) => {
      const { memory } = this;

      const assets = memory.getBundles()
        .map(({ filename, buffer }) => {
          return {
            [publicPath(filename)]: {
              source: () => buffer.toString(),
              size: () => buffer.length
            }
          };
        });

      compilation.assets = merge(compilation.assets, ...assets);
      callback();
    });

    if (inject) {
      compiler.plugin('compilation', compilation => {
        compilation.plugin(
          'html-webpack-plugin-before-html-generation',
          (htmlPluginData, callback) => {
            const { memory } = this;
            const bundlesPublicPaths = memory.getBundles().map(({ filename }) => publicPath(filename));

            log('injecting scripts to', htmlPluginData.outputName);
            
            bundlesPublicPaths.forEach((bundleName) => {
              log('injecting', bundleName);
            });

            htmlPluginData.assets.js = concat(
              bundlesPublicPaths,
              htmlPluginData.assets.js
            );

            callback();
          }
        );
      });
    }
  }
}

export default Plugin;
