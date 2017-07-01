import webpack from 'webpack';
import createConfig from './createConfig';

const createCompiler = (settings) => {
  const config = createConfig(settings);
  return webpack(config);
};

export default createCompiler;
