import MemoryFileSystem from 'memory-fs';
import fs from './utils/fs';
import Promise from 'bluebird';
import { cacheDir } from './paths';
import path from 'path';

const { stringify, parse } = JSON;

const initializeMFS = () => {
  const mfs = new MemoryFileSystem();
  mfs.mkdirSync('/assets');
  return mfs;
};

const cleanup = mfs => {
  mfs.rmdirSync('/assets');
  mfs.mkdirSync('/assets');
  return mfs;
};

const createSync = (cacheDir, fs, mfs) => (hash, stats) => {
  mfs = cleanup(mfs);

  mfs.writeFileSync('/stats.json', stringify(stats));

  return Promise.resolve(stats.assets)
    .map(({ name }) => name)
    .map(filename => {
      return Promise.props({
        filename,
        buffer: fs.readFileAsync(path.join(cacheDir, hash, filename)),
      });
    })
    .each(({ filename, buffer }) => {
      mfs.writeFileSync(path.posix.join('/assets', filename), buffer);
    });
};

const createGetAssets = mfs => () => {
  return mfs.readdirSync('/assets').map(filename => ({
    filename,
    buffer: mfs.readFileSync(path.posix.join('/assets', filename))
  }));
};

const createGetStats = mfs => () => {
  try {
    const buffer = mfs.readFileSync('/stats.json');
    return parse(buffer);
  } catch (err) {
    return null;
  }
};

export const _createMemory = (fs, cacheDir) => () => {
  const mfs = initializeMFS();

  return {
    sync: createSync(cacheDir, fs, mfs),
    getAssets: createGetAssets(mfs),
    getStats: createGetStats(mfs),
  };
};

export default _createMemory(fs, cacheDir);
