import cloneDeepWith from 'lodash/cloneDeepWith';
import isObject from 'lodash/isObject';
import isPlainObject from 'lodash/isPlainObject';

const safeClone = config => {
  return cloneDeepWith(config, value => {
    if (isObject(value) && (!isPlainObject(value) && !Array.isArray(value))) {
      return value;
    }
  });
};

export default safeClone;
