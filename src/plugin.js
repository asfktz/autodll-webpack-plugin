import { DllReferencePlugin } from 'webpack';
import path from 'path';

import compileIfNeeded from './compileIfNeeded';
import createCompiler from './createCompiler';
import { cacheDir } from './paths';
import { concat, merge, keys } from './utils/index.js';
import normalizeEntry from './normalizeEntry';
import createLogger from './createLogger';

import createMemory from './createMemory';

export const getManifestPath = bundleName =>
  path.resolve(cacheDir, `${bundleName}.manifest.json`);

export const createSettings = ({ entry, ...settings }) => {
  const defaults = {
    context: __dirname,
    path: '',
    entry: null,
    filename: '[name].js',
    inject: false,
    debug: false
  };

  return merge(defaults, settings, {
    entry: normalizeEntry(entry)
  });
};

class Plugin {
  constructor(settings) {
    this.settings = createSettings(settings);
  }

  apply(compiler) {
    const { context, inject, entry, path: outputPath } = this.settings;
    const log = createLogger(this.settings.debug);
    
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
    
    const onRun = (compiler, callback) => (
      compileIfNeeded(this.settings, () => createCompiler(this.settings))
        .then(() => createMemory()
          .then((memory) => {
            this.initialized = true;
            this.memory = memory;
          })
        )    
        // .then(log.tap('initialized'))
        .then(callback)
    );

    compiler.plugin('watch-run', onRun);
    compiler.plugin('run', onRun);

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
