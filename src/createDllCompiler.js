import webpack from 'webpack';
import createConfig from './createConfig';

const createDllCompiler = (settings, parentConfig) => () => {
  const config = createConfig(settings, parentConfig);
  return webpack(config);
};

export default createDllCompiler;
