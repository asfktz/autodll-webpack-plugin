import omit from 'lodash/omit';
import isNil from 'lodash/isNil';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import stubObject from 'lodash/stubObject';
import { merge } from './utils';
import createHash from './createHash';
import normalizeEntry from './normalizeEntry';
import getEnv from './getEnv';


const getInstanceId = index => `instance_${index}`;
const getContext = () => process.cwd();

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

export const _createSettings = (getEnv, getContext) => ({ originalSettings, index }) => {
  const { entry, env, inherit, ...otherSettings } = originalSettings;
  
  const defaults = {
    context: getContext(),
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

export default _createSettings(getEnv, getContext);
