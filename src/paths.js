import findCacheDir from 'find-cache-dir';
import get from 'lodash/get';
import { join } from 'path';

export const cacheDir = findCacheDir({ name: 'autodll-webpack-plugin' });

export const createGetPublicPath = (compilerOptions, dllPath) => {
  return (filename, relative = false) => {
    const base = get(compilerOptions, 'output.publicPath', '');
    const relativePath = join(dllPath, filename);

    return relative ? relativePath : join(base, relativePath);
  };
};
