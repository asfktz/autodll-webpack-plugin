import mergeAll from 'lodash/fp/mergeAll';

import { _createSettings } from '../../src/createSettings';
import { getEnv } from './mocks';

const createSettings = _createSettings(getEnv);

const createSettingsHelper = (base) => (overrides = {}) => {
  return createSettings(
    mergeAll([base, {
      originalSettings: overrides
    }])
  );
};

export default createSettingsHelper;