Webpack's own DllPlugin it great, it can drastically reduce the amount of time needed to build (and rebuild) your bundles by reducing the amount of work needs to be done.

If you think about it, most of the code in your bundles come from NPM modules that you're rarely going to touch. You know that, but Webpack doesn't. So every time it compiles it has to analyze and build them too - and that takes time.

The DllPlugin allows you to to create in advance a separate bundle for all of those modules, and teach Webpack to read them from that bundle instead. 

And if I may quote someone else's numbers for a project that requires: <br>
react, react-dom, redux, react-redux, lodash, react-bootstrap, immutable, redux-saga, reselect, babel-polyfill, react-router

You can see how impresive it is:

| Commit | First build | second build | Rebuild 1 | Rebuild 2 | Rebuild 3 | File 2 | File 2 RB |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **PreDLL** | 6801ms | 7536ms | 1489ms | 1192ms | 816ms | 1248ms | 1226ms |
| **PostDLL** | 2965ms | 2202ms | 633ms | 145ms | 222ms | 230ms | 241ms |

## If the DllPlugin is so great, Why sould I use AutoDllPlugin?

While the DllPlugin has many advances, its main drawback it that it requires a lot of boilerplate

What the AutoDllPlugin do it hides away all of that complexity,
every time you build

When you build your bundle for the first time, the AutoDllPlugin will Compiles the DLL for you, and reference all the specified modules from your bundle to the DLL bundle.

The next time you compile your code,  AutoDllPlugin will skip the build and read it from the cache instead.

AutoDllPlugin will also rebuild your DLLs every time you install or remove a node module, or change the Plugin's configuration.

The way that DLL works means that you have to load it somehow before your bundle loads. That's commonly done by including in the HTML another script tag before your own.

And Because this is such a common task, AutoDllPlugin can do it for you (in conjunction with the HtmlPlugin), by setting `inject : true`

The Plugin truly shines with Hot reloading

## Basic Usage:

./webpack.config.js
```js
const webpack = require('webpack');
const path = require('path');
const AutoDllPlugin = require('autodll-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.js'
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  plugins: [
    new AutoDllPlugin({
      context: __dirname,
      filename: '[name].dll.js',
      entry: {
        vendor: [
          'react',
          'react-dom',
          'moment'
        ]
      }
    })
  ]
};
```

./index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AutoDllPlugin Test</title>
</head>
<body>
  
  ...
  
  <!-- Add the dll bundles before your app's bundle  -->
  <script src="dist/vendor.dll.js"></script>
  <script src="dist/app.bundle.js"></script>
</body>
</html>
```


## Recommended Usage:

```js
const webpack = require('webpack');
const path = require('path');
const AutoDllPlugin = require('autodll-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: './src/index.html',
    }),
    new AutoDllPlugin({
      inject: true,
      context: __dirname,
      filename: '[name]_[hash].js',
      path: './dll',
      entry: {
        vendor: [
          'react',
          'react-dom',
          'moment'
        ]
      }
    })
  ]
};
```
