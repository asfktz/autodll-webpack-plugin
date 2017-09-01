const path = require('path');
const axios = require('axios');

const PORT = 8081;

const client = axios.create({
  baseURL: `http://localhost:${PORT}/`
});

module.exports = (webpack, WebpackDevServer) => (config, runTests) => {
  return new Promise((resolve) => {
    const compiler = webpack(config);

    const devServer = new WebpackDevServer(compiler, {
      watchOptions: {
        // aggregateTimeout: 1000,
        // ignored: '/node_modules/'
      },

      quiet: true,
      proxy: {},
      contentBase: path.join(__dirname, 'public') // boolean | string | array, static file location
    });

    runTests({
      compiler,
      done: () => {
        devServer.close();
        resolve();
      }
    });

    devServer.listen(PORT, null, err => {
      if (err) {
        return console.log(err);
      }

      console.log('Starting the development server...\n');
    });
  });
};