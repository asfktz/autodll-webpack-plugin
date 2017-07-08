import crypto from 'crypto';
import path from 'path';
import fs from './utils/fs';
import { cacheDir } from './paths';

const getContents = watchPath => {
  try {
    if (fs.existsSync(watchPath)) {
      if (fs.lstatSync(watchPath).isDirectory()) {
        if (watchPath.startsWith(cacheDir)) {
          return '';
        }
        return fs
          .readdirSync(watchPath)
          .map(p => getContents(path.join(watchPath, p)))
          .join('');
      } else {
        return fs.readFileSync(watchPath, 'utf-8');
      }
    }
    return '';
  } catch (e) {
    //Failed to read file, fallback to string
    return '';
  }
};

const createHash = settings => {
  const hash = crypto.createHash('md5');
  const settingsJSON = JSON.stringify(settings);

  hash.update(settingsJSON);

  // if (Array.isArray(settings.watch)) {
  //   hash.update(settings.watch.map(getContents).join(''));
  // }

  return [settings.env, settings.id, hash.digest('hex')].join('_');
};

export default createHash;