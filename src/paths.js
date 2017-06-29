import findCacheDir from 'find-cache-dir';
import path from 'path';

export const cacheDir = findCacheDir({ name: 'autodll-webpack-plugin' });

export const getManifestPath = bundleName =>
  path.resolve(cacheDir, `${bundleName}.manifest.json`);