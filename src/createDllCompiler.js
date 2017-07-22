import webpack from 'webpack';

const createDllCompiler = (config) => () => {
  return webpack(config);
};

export default createDllCompiler;
