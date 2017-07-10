import webpack from 'webpack';
import createConfig from './createConfig';

const createCompiler = settings => {
  const config = createConfig(settings);
  //TODO: run in watch mode if settings.watch is set
  return webpack(config);
};

export default createCompiler;
