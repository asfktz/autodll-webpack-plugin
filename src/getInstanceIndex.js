import get from 'lodash/get';

export const isAutoDll = plugin => get(plugin, ['constructor', 'name']) === 'AutoDLLPlugin';

const getInstanceIndex = (plugins, instance) => {
  return plugins.filter(isAutoDll).indexOf(instance);
};

export default getInstanceIndex;
