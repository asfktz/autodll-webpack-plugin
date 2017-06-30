## What
Webpack's own DllPlugin it great, it can drastically reduce the amount of time needed to build (and rebuild) your bundles by reducing the amount of work needs to be done.

If you think about it, most of the code in your bundles come from NPM modules that you're rarely going to touch. You know that, but Webpack doesn't. So every time it compiles it has to analyze and build them too - and that takes time.

The DllPlugin allows you to to create in advance a separate bundle for all of those modules, and teach Webpack to read them from that bundle instead. 

And to quotes someone else's numbers for a project that imports: <br>
react, react-dom, redux, react-redux, lodash, react-bootstrap, immutable, redux-saga, reselect, babel-polyfill, react-router

| Commit | First build | second build | Rebuild 1 | Rebuild 2 | Rebuild 3 | File 2 | File 2 RB |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **PreDLL** | 6801ms | 7536ms | 1489ms | 1192ms | 816ms | 1248ms | 1226ms |
| **PostDLL** | 2965ms | 2202ms | 633ms | 145ms | 222ms | 230ms | 241ms |

## Why

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
