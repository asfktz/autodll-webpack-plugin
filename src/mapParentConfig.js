import omit from 'lodash/omit';
import isFunction from 'lodash/isFunction';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import isPlainObject from 'lodash/isPlainObject';

import { safeClone } from './utils';

// The user can control what to inherit from the parent config
// by passing a fucntion to inherit the user can take only the properties he wants.

const defaultExclude = ['plugins'];

const createDefaultMapper = exclude => parentConfig => omit(parentConfig, exclude);

const createMapper = inherit => {
  if (isFunction(inherit)) {
    return inherit;
  }

  if (isPlainObject(inherit)) {
    const exclude = Array.isArray(inherit.exclude) ? inherit.exclude : defaultExclude;
    return createDefaultMapper(exclude);
  }

  if (inherit === true) {
    return createDefaultMapper(defaultExclude);
  }

  // do not inherit
  return null;
};

const mapParentConfig = (settings, parentConfig) => {
  const mapFn = createMapper(settings.inherit);

  // skip it if no mapFn returned
  if (!mapFn) {
    return {};
  }

  let _originalParentConfig;

  if (settings.debug) {
    _originalParentConfig = cloneDeep(parentConfig);
  }

  const mappedParentConfig = mapFn(safeClone(parentConfig));

  if (settings.debug && !isEqual(parentConfig, _originalParentConfig)) {
    throw new Error('Do not modify the original config');
  }

  return mappedParentConfig;
};

export default mapParentConfig;
