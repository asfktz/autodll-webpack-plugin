const path = require('path');

const PORT = 8085;

const createRunner = (webpack, WebpackDevServer) => (config, runTests) => {
  return new Promise(resolve => {
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

    const done = () => {
      devServer.close();
      resolve();
    };

    runTests({ compiler, done });

    //on clean exit
    process.on('exit', done);

    //catches ctrl+c event
    process.on('SIGINT', done);

    //catches uncaught exceptions
    process.on('uncaughtException', done);

    devServer.listen(PORT, null, err => {
      if (err) {
        return console.log(err);
      }

      console.log('Starting the development server...\n');
    });
  });
};

module.exports = createRunner;
