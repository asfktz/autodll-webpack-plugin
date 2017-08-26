import findCacheDir from 'find-cache-dir';
import { join } from 'path';

export const cacheDir = findCacheDir({ name: 'autodll-webpack-plugin' });