import keys from 'lodash/keys';
import isArray from 'lodash/isArray';
import isNil from 'lodash/isNil';

const normalizeEntry = entries => {
  if (isNil(entries)) return {};

  return keys(entries).reduce((validEntries, key) => {
    if (isArray(entries[key]) && entries[key].length) {
      validEntries[key] = entries[key];
    }

    return validEntries;
  }, {});
};

export default normalizeEntry;
