import { merge } from './utils';
import createHash from './createHash';
import normalizeEntry from './normalizeEntry';

const getInstanceId = index => `instance_${index}`;
const getEnv = env => env || process.env.NODE_ENV || 'development';

const createSettings = ({ originalSettings, index }) => {
  const { entry, env, ...otherSettings } = originalSettings;

  const defaults = {
    context: process.cwd(),
    path: '',
    entry: null,
    filename: '[name].js',
    inject: false,
    debug: false
  };

  const settings = merge(defaults, otherSettings, {
    entry: normalizeEntry(entry),
    id: getInstanceId(index),
    env: getEnv(env)
  });

  return merge(settings, {
    hash: createHash(settings)
  });
};

export default createSettings;
