import get from 'lodash/get';
import isNil from 'lodash/isNil';
import createHash from './createHash';
import normalizeEntry from './normalizeEntry';
import getEnv from './getEnv';

const getInstanceId = index => `instance_${index}`;

export const _createSettings = getEnv => ({ originalSettings, index, parentConfig }) => {
  const { entry, env, inherit, ...otherSettings } = originalSettings;

  const defaults = {
    // Keep an eye on this one.
    // Till now process.cwd() was used as default
    // but using parentConfig.context makes more sense.
    // From webpack's docs, it defaults to process.cwd() too.
    context: parentConfig.context,

    // Whether the user wants to inherit from parent config or not, we must have publicPath.
    // we'll use it later when we read the dll bundles from memory.
    // defaults to '/'
    publicPath: get(parentConfig, 'output.publicPath', '/'),

    path: '',
    entry: null,
    filename: '[name].js',
    inject: false,
    debug: false,
    inherit: false,
    config: {},
  };

  const settings = {
    ...defaults,
    ...otherSettings,
    entry: normalizeEntry(entry),
    id: getInstanceId(index),
    env: getEnv(env),
    inherit: isNil(inherit) ? false : inherit,
  };

  return {
    ...settings,
    hash: createHash(settings),
  };
};

export default _createSettings(getEnv);
