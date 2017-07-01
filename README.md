# AutoDllPlugin
Webpack's DllPlugin without the boilerplate

`npm install --save-dev autodll-webpack-plugin`

---

Webpack's own DllPlugin it great, it can drastically reduce the amount of time needed to build (and rebuild) your bundles by reducing the amount of work needs to be done.

If you think about it, most of the code in your bundles come from NPM modules that you're rarely going to touch. You know that, but Webpack doesn't. So every time it compiles it has to analyze and build them too - and that takes time.

The DllPlugin allows you to to create in advance a separate bundle for all of those modules, and teach Webpack to reference them to that bundle instead. 

That lead to a dramatic reduction in the amount of time takes Webpack to build your bundles.

For example, these are the measurements for the  [performance test](https://github.com/asfktz/autodll-webpack-plugin/tree/master/examples/performance) that you can find in the [examples](https://github.com/asfktz/autodll-webpack-plugin/tree/master/examples) folder:


|                   | **Build Time**    | **DevServer Rebuild** |
|-------------------|-------------------|-----------------------|
| **Without DllPlugin** | 16461ms - 17310ms | 2991ms - 3505ms       |
| **With DllPlugin**    | 2924ms - 2997ms   | 316ms - 369ms         |




## The DllPlugin sounds great! So why AutoDllPlugin?

While the DllPlugin has many advances, its main drawback is that it requires a lot of boilerplate

AutoDllPlugin serves as a high-level plugin for both the DllPlugin and the DllReferencePlugin, and hides away most of their complexity.

When you build your bundle for the first time, the AutoDllPlugin Compiles the DLL for you, and reference all the specified modules from your bundle to the DLL.

The next time you compile your code,  AutoDllPlugin will skip the build and read from the cache instead.

AutoDllPlugin will rebuild your DLLs every time you install or remove a node module, or change the Plugin's configuration.

When using Webpack's Dev Server, the bundle are loaded into the memory, to prevent unnecessary reads from the FileSystem.

The way that DLL works means that you have to load the DLL bundles somehow before your own bundle. That's commonly done by adding another script tag to the HTML.

And Because that is such a common task, AutoDllPlugin can do it for you (in conjunction with the HtmlPlugin)

```js
plugins: [
  new HtmlWebpackPlugin({
    inject: true,
    template: './src/index.html',
  }),
  new AutoDllPlugin({
    inject: true, // will inject the DLL bundles to index.html
    context: __dirname,
    filename: '[name]_[hash].js',
    entry: {
      vendor: [
        'react',
        'react-dom',
        'moment'
      ]
    }
  })
]
```

Will Result in:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Test</title>
</head>
<body>
  
  ...
  
  <script src="dist/vendor.dll.js"></script>
  <script src="dist/main.bundle.js"></script>
</body>
</html>
```


## Basic Usage ([example](https://github.com/asfktz/autodll-webpack-plugin/tree/master/examples/basic)):

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

## Recommended Usage ([example](https://github.com/asfktz/autodll-webpack-plugin/tree/master/examples/recommended)):

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


## Running Examples

1. `git clone https://github.com/asfktz/autodll-webpack-plugin`
2. `cd examples/recommended`
3. `npm install`
3. `npm start` or `npm run build`
