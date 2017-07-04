# AutoDllPlugin Watch Test

### How to install

1. `git clone git@github.com:asfktz/autodll-webpack-plugin.git`
2. `cd examples/watch`
3. `npm install`
4. `npm run`
5. `open http://localhost:8080`


### How to use

1. Open `./src/App.js` and change the Text to see how long it takes for webpack to build when AutoDllPlugin is active.
2. Then go to `./webpack.config.js`, remove the Plugin, and try again.

Note: Look for the word "Time:" in your terminal output, to see long each build took.
