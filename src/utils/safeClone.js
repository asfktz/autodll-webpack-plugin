import cloneDeepWith from 'lodash/cloneDeepWith';
import isObject from 'lodash/isObject';
import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';

const safeClone = config => {
  return cloneDeepWith(config, value => {
    if (isObject(value) && (!isPlainObject(value) && !isArray(value))) {
      return value;
    }
  });
};

export default safeClone;
