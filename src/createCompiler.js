import webpack from 'webpack';

const createCompiler = config => {
  return webpack(config);
};

export default createCompiler;
