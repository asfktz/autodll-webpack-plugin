import MemoryFileSystem from 'memory-fs';
import fs from './utils/fs';
import Promise from 'bluebird';
import { cacheDir } from './paths';
import path from 'path';
import get from 'lodash/get';

const { stringify, parse } = JSON;

const cleanup = mfs => {
  mfs.rmdirSync('/assets');
  mfs.mkdirSync('/assets');
  return mfs;
};

const createWriteAssets = (cacheDir, fs, mfs, shouldUpdate) => (hash, stats) => {
  if (!shouldUpdate(stats)) return;

  mfs = cleanup(mfs);

  return Promise.resolve(stats.assets)
    .map(({ name }) => name)
    .map(filename =>
      Promise.props({
        filename,
        buffer: fs.readFileAsync(path.join(cacheDir, hash, filename))
      })
    )
    .each(({ filename, buffer }) => {
      mfs.writeFileSync(path.join('/assets', filename), buffer);
    });
};

const createWriteStats = mfs => stats => {
  return mfs.writeFileSync('/stats.json', stringify(stats));
};

const createGetAssets = mfs => () => {
  return mfs.readdirSync('/assets').map(filename => ({
    filename,
    buffer: mfs.readFileSync(`/assets/${filename}`)
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

const createShouldUpdate = getStats => stats => {
  const lastStats = getStats();
  return get(lastStats, 'hash') === stats.hash;
};

export const _createMemory = (fs, cacheDir) => () => {
  const mfs = new MemoryFileSystem();

  mfs.mkdirSync('/assets');
  
  const getAssets = createGetAssets(mfs);
  const getStats = createGetStats(mfs);
  const writeStats = createWriteStats(mfs);
  const shouldUpdate = createShouldUpdate(getStats);
  const writeAssets = createWriteAssets(cacheDir, fs, mfs, shouldUpdate);

  return {
    writeAssets,
    writeStats,
    getAssets,
    getStats
  };
};

export default _createMemory(fs, cacheDir);
