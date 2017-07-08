import { DllReferencePlugin } from 'webpack';
import path from 'path';

import compileIfNeeded from './compileIfNeeded';
import createCompiler from './createCompiler';
import createHash from './createHash';
import { cacheDir, createGetPublicPath } from './paths';
import { concat, merge, keys } from './utils/index.js';
import normalizeEntry from './normalizeEntry';

import createMemory from './createMemory';

export const getManifestPath = hash => bundleName =>
  path.resolve(cacheDir, hash, `${bundleName}.manifest.json`);

const getInstanceId = (index) => `instance_${index}`;

export const createSettings = ({ originalSettings, index, env = 'development' }) => {
  const { entry, ...otherSettings } = originalSettings;

  const defaults = {
    context: __dirname,
    path: '',
    entry: null,
    filename: '[name].js',
    inject: false,
    debug: false
  };

  const settings = merge(defaults, otherSettings, {
    entry: normalizeEntry(entry),
    id: getInstanceId(index),
    nodeEnv: env
  });

  return merge(settings, {
    hash: createHash(settings)
  });
};

class AutoDLLPlugin {
  constructor(settings) {
    this.originalSettings = settings;
  }

  apply(compiler) {

    const settings = createSettings({
      originalSettings: this.originalSettings,
      index: compiler.options.plugins.indexOf(this),
      env: process.env.NODE_ENV
    });

    const { context, inject, entry } = settings;
    
    const getPublicPath = createGetPublicPath(
      compiler.options,
      settings.path
    );

    keys(entry)
      .map(getManifestPath(settings.hash))
      .forEach(manifestPath => {
        new DllReferencePlugin({
          context: context,
          manifest: manifestPath,
        }).apply(compiler);
      });

    compiler.plugin('before-compile', (params, callback) => {
      params.compilationDependencies = params.compilationDependencies.filter(
        path => !path.startsWith(cacheDir)
      );

      callback();
    });

    const onRun = (compiler, callback) =>
      compileIfNeeded(settings, () => createCompiler(settings))
        .then(() =>
          createMemory(settings.hash).then(memory => {
            this.initialized = true;
            this.memory = memory;
          })
        )
        .then(callback);

    compiler.plugin('watch-run', onRun);
    compiler.plugin('run', onRun);

    compiler.plugin('emit', (compilation, callback) => {
      const { memory } = this;
      
      const assets = memory.getBundles()
        .map(({ filename, buffer }) => {
          const relativePath = getPublicPath(filename, true);
          
          return {
            [relativePath]: {
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
            const bundlesPublicPaths = memory.getBundles().map(({ filename }) => getPublicPath(filename));

            htmlPluginData.assets.js = concat(
              bundlesPublicPaths,
              htmlPluginData.assets.js
            );

            callback(null, htmlPluginData);
          }
        );
      });
    }
  }
}

export default AutoDLLPlugin;
