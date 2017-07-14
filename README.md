[![Build Status](https://travis-ci.org/asfktz/autodll-webpack-plugin.svg?branch=master)](https://travis-ci.org/asfktz/autodll-webpack-plugin)

# AutoDllPlugin
Webpack's DllPlugin without the boilerplate

`npm install --save-dev autodll-webpack-plugin`

---

Webpack's own DllPlugin it great, it can drastically reduce the amount of time needed to build (and rebuild) your bundles by reducing the amount of work needs to be done.

If you think about it, most of the code in your bundles come from NPM modules that you're rarely going to touch. You know that, but Webpack doesn't. So every time it compiles it has to analyze and build them too - and that takes time.

The DllPlugin allows you to to create a separate bundle in advance for all of those modules, and teach Webpack to reference them to that bundle instead. 

That leads to a dramatic reduction in the amount of time takes Webpack to build your bundles.

For example, these are the measurements for the  [performance test](https://github.com/asfktz/autodll-webpack-plugin/tree/master/examples/performance) that you can find in the [examples](https://github.com/asfktz/autodll-webpack-plugin/tree/master/examples) folder:

|                   |  **Without DllPlugin**  | **With DllPlugin** |
|-------------------|-------------------|-----------------------|
| **Build Time** | 16461ms - 17310ms | 2991ms - 3505ms |
| **DevServer Rebuild** | 2924ms - 2997ms | 316ms - 369ms |



## The DllPlugin sounds great! So why AutoDllPlugin?

While the DllPlugin has many advantages, its main drawback is that it requires a lot of boilerplate.

AutoDllPlugin serves as a high-level plugin for both the DllPlugin and the DllReferencePlugin, and hides away most of their complexity.

When you build your bundle for the first time, the AutoDllPlugin Compiles the DLL for you, and references all the specified modules from your bundle to the DLL.

The next time you compile your code,  AutoDllPlugin will skip the build and read from the cache instead.

AutoDllPlugin will rebuild your DLLs every time you change the Plugin's configuration, install or remove a node module.

When using Webpack's Dev Server, the bundle are loaded into the memory preventing unnecessary reads from the FileSystem.

With the way the DLLPlugin works, you must load the DLL bundles before your own bundle. This is commonly accomplished by adding an additional script tag to the HTML.

Because that is such a common task, AutoDllPlugin can do this for you (in conjunction with the HtmlPlugin ).

```js
plugins: [
  new HtmlWebpackPlugin({
    inject: true,
    template: './src/index.html',
  }),
  new AutoDllPlugin({
    inject: true, // will inject the DLL bundles to index.html
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
    publicPath: '/'
  },

  plugins: [
    new AutoDllPlugin({
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
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: './src/index.html',
    }),
    new AutoDllPlugin({
      debug: true,
      inject: true,
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

## Options

<table>
    <thead>
        <tr>
            <th>Option</th>
            <th>Type</th>
            <th>Default</th>
            <th>Decription</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>entry</td>
            <td>Object</td>
            <td>{}</td>
            <td>
              <p>
                The entry points for the DLL's. <br>
                Think of it as the entry option in your webpack config. <br>
                Each entry point represents a DLL bundle and expects an array of modules. 
              </p>
<pre>entry: {
    // Create a DLL from NPM modules:
    vendor: [
      'react',
      'react-dom',
      'moment',
      'lodash'
    ],
    // Create a DLL from a part of your app
    // that you rarely change:
    admin: [
        './src/admin/index.js'
    ]
}</pre>
            </td>
        </tr>
        <tr>
            <td>filename</td>
            <td>String</td>
            <td>"[name].js"</td>
            <td>
              <p>The filename template. <br> Same as webpack's
                <a href="https://webpack.js.org/configuration/output/#output-filename">output.filename</a>.
              </p>
              <p>Examples:</p>
              <ul>
                <li>[name]_[hash].dll.js</li>
                <li>[id].bundle.js</li>
              </ul>
            </td>
        </tr>
        <tr>
            <td>context</td>
            <td>String</td>
            <td><p>process.cwd()</p></td>
            <td>
              <p>
                The base directory, an <strong>absolute path</strong>, for resolving entry points and loaders from the configuration.
              </p>
              <p>
                Same as webpack's <a href="https://webpack.js.org/configuration/entry-context/#context">context</a>
              </p>
              <p>
                <b>It is very important to make sure the context is set correctly</b>, <br>
                otherwise, you'll end up with having the same modules both in the DLL bundles and in your main bundles!
              </p>
              <p>Most of the time, the defaults (the current directory) should work for you, here's how it should work:</p>
              <p>If your webpack's config stored at the base of your project:</p>
              <p><i>~/my-project/webpack.config.js</i></p>
              <p>Set it up like this:</p>
<pre>
{
  context: __dirname
}
</pre>

<p>If your webpack's config stored in a nested directory:</p>
<p><i>~/my-project/<b>config</b>/webpack.config.js</i></p>
<p>It should look like this:</p>
<pre>
{
  context: path.join(__dirname, '..')
}
</pre>
          </td>
        </tr>
        <tr>
            <td>inject</td>
            <td>Boolean</td>
            <td>false</td>
            <td>
              <p>By setting inject to true, AutoDLL will inject the DLL bundles into the HTML for you.</p>
              <p>
                <b>Note:</b> <a href="https://github.com/jantimon/html-webpack-plugin">htmlWebpackPlugin</a>
                is required for this feature to work.
              </p>
            </td>
        </tr>
        <tr>
            <td>path</td>
            <td>String</td>
            <td>""</td>
            <td>
                The path for the DLL bundles, relative to webpack's
                <a href="https://webpack.js.org/configuration/output/#output-publicpath">output.publicPath</a>
            </td>
        </tr>
        <tr>
            <td>debug</td>
            <td>Boolean</td>
            <td>false</td>
            <td>Use debug mode the see more clearly what AutoDLL is doing.</td>
        </tr>
        <tr>
            <td>plugins</td>
            <td>Array</td>
            <td>[]</td>
            <td>
              <p>
                Plugins for the DLL compiler. Same as webpack's
                <a href="https://webpack.js.org/configuration/plugins/">plugins</a>.
              </p>
              <pre>plugins: [
  new webpack.optimize.UglifyJsPlugin()
]</pre>
            </td>
        </tr>
    </tbody>
</table>


## Running Examples

1. `git clone git@github.com:asfktz/autodll-webpack-plugin.git`
2. `cd autodll-webpack-plugin`
3.  `npm install`
4. `cd examples/recommended`
5. `npm install`
6. `npm start` or `npm run build`
