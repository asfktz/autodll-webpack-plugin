import { merge } from './utils';
import createHash from './createHash';
import normalizeEntry from './normalizeEntry';
import omit from 'lodash/omit';
import isNil from 'lodash/isNil';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import stubObject from 'lodash/stubObject';

const getInstanceId = index => `instance_${index}`;
const getEnv = env => env || process.env.NODE_ENV || 'development';

const getExclude = inherit => {
  return isArray(inherit.exclude) ? inherit.exclude : ['plugins'];
};

const createDefaultInherit = exclude => parentConfig => {
  return omit(parentConfig, exclude);
};

const getInherit = inherit => {
  if (isNil(inherit) || inherit === false) {
    return stubObject;
  }

  if (isFunction(inherit)) {
    return inherit;
  }

  let exclude = getExclude(inherit);
  return createDefaultInherit(exclude);
};

const createSettings = ({ originalSettings, index }) => {
  const { entry, env, inherit, ...otherSettings } = originalSettings;

  const defaults = {
    context: process.cwd(),
    path: '',
    entry: null,
    filename: '[name].js',
    inject: false,
    debug: false,
    inherit: false,
    config: {}
  };

  const settings = merge(defaults, otherSettings, {
    entry: normalizeEntry(entry),
    id: getInstanceId(index),
    env: getEnv(env),
    inherit: getInherit(inherit)
  });

  return merge(settings, {
    hash: createHash(settings)
  });
};

export default createSettings;
