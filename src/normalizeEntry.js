import isPlainObject from 'lodash/isPlainObject';

// The point of normalizeEntry is to be a little bit more forgiving than how webpack treats its entries.
// If you pass an empty array, it will just exclude that entry.

const normalizeEntry = entries => {
  if (!isPlainObject(entries)) {
    return entries;
  }

  return Object.keys(entries).reduce((validEntries, key) => {
    if (Array.isArray(entries[key]) && entries[key].length) {
      validEntries[key] = entries[key];
    }

    return validEntries;
  }, {});
};

export default normalizeEntry;
