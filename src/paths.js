import findCacheDir from 'find-cache-dir';
import { join } from 'path';

export const cacheDir = findCacheDir({ name: 'autodll-webpack-plugin' });

export const createGetPublicDllPath = (settings) => {
  return (filename, relative = false) => {
    const relativePath = join(settings.path, filename);

    return relative ? relativePath : join(settings.publicPath, relativePath);
  };
};
