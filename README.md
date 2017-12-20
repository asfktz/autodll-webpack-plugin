[![Build Status for Linux](https://travis-ci.org/asfktz/autodll-webpack-plugin.svg?branch=master)](https://travis-ci.org/asfktz/autodll-webpack-plugin)
[![Build Status for Windows](https://ci.appveyor.com/api/projects/status/github/asfktz/autodll-webpack-plugin?branch=master&svg=true)](https://ci.appveyor.com/project/asfktz/autodll-webpack-plugin)
[![Downloads](https://img.shields.io/npm/dm/autodll-webpack-plugin.svg)](https://www.npmjs.com/package/autodll-webpack-plugin)
[![Join the chat at https://gitter.im/autodll-webpack-plugin/Lobby](https://badges.gitter.im/autodll-webpack-plugin/Lobby.svg)](https://gitter.im/autodll-webpack-plugin/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


# AutoDllPlugin
Webpack's DllPlugin without the boilerplate

`npm install --save-dev autodll-webpack-plugin`

---

## Table of contents

- [Introduction](#introduction)
- [Options](#options)
- [FAQ](#faq)
- [Examples](#running-examples)


## Introduction

Webpack's own DllPlugin it great, it can drastically reduce the amount of time needed to build (and rebuild) your bundles by reducing the amount of work needs to be done.

If you think about it, most of the code in your bundles come from NPM modules that you're rarely going to touch. You know that, but Webpack doesn't. So every time it compiles it has to analyze and build them too - and that takes time.

The DllPlugin allows you to to create a separate bundle in advance for all of those modules, and teach Webpack to reference them to that bundle instead.

That leads to a dramatic reduction in the amount of time takes Webpack to build your bundles.

For example, these are the measurements for the  [performance test](examples/performance) that you can find in the [examples](examples) folder:

|                   |  **Without DllPlugin**  | **With DllPlugin** |
|-------------------|-------------------|-----------------------|
| **Build Time** | 16461ms - 17310ms | 2991ms - 3505ms |
| **DevServer Rebuild** | 2924ms - 2997ms | 316ms - 369ms |



### The DllPlugin sounds great! So why AutoDllPlugin?

While the DllPlugin has many advantages, it's main drawback is that it requires a lot of boilerplate.

AutoDllPlugin serves as a high-level plugin for both the DllPlugin and the DllReferencePlugin, and hides away most of their complexity.

When you build your bundle for the first time, the AutoDllPlugin Compiles the DLL for you, and references all the specified modules from your bundle to the DLL.

The next time you compile your code, AutoDllPlugin will skip the build and read from the cache instead.

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
        'react-dom'
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


### Basic Usage ([example](examples/basic)):

```js
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
          'react-dom'
        ]
      }
    })
  ]
};
```

### Recommended Usage ([example](examples/recommended)):

While it's not required, using AutoDllPlugin together with [HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin) is highly recommended, because its saves you the trouble of manually adding the DLL bundles to the HTML by yourself.

Use AutoDllPlugin's `inject` option to enable this feature.

```js
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
      inject: true, // will inject the main bundle to index.html
      template: './src/index.html',
    }),
    new AutoDllPlugin({
      inject: true, // will inject the DLL bundle to index.html
      debug: true,
      filename: '[name]_[hash].js',
      path: './dll',
      entry: {
        vendor: [
          'react',
          'react-dom'
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
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>entry</td>
            <td>Object</td>
            <td><code>{}</code></td>
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
            <td><code>"[name].js"</code></td>
            <td>
              <p>The filename template. <br> Same as webpack's
                <a href="https://webpack.js.org/configuration/output/#output-filename">output.filename</a>.
              </p>
              <p>Examples:</p>
              <ul>
                <li><code>[name]_[hash].dll.js</code></li>
                <li><code>[id].bundle.js</code></li>
              </ul>
            </td>
        </tr>
        <tr>
            <td>context</td>
            <td>String</td>
            <td><code>process.cwd()</code></td>
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
              <p>If your webpack config is stored at the base of your project:</p>
              <p><i>~/my-project/webpack.config.js</i></p>
              <p>Set it up like this:</p>
<pre>
{
  context: __dirname
}
</pre>

<p>If your webpack config is stored in a nested directory:</p>
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
            <td><code>false</code></td>
            <td>
              <p>By setting inject to true, AutoDLL will inject the DLL bundles into the HTML for you.</p>
              <p>
                <b>Note:</b> <a href="https://github.com/jantimon/html-webpack-plugin">HtmlWebpackPlugin</a>
                is required for this feature to work.
              </p>
            </td>
        </tr>
        <tr>
            <td>path</td>
            <td>String</td>
            <td><code>""</code></td>
            <td>
                The path for the DLL bundles, relative to webpack's
                <a href="https://webpack.js.org/configuration/output/#output-publicpath">output.publicPath</a>
            </td>
        </tr>
        <tr>
            <td>debug</td>
            <td>Boolean</td>
            <td><code>false</code></td>
            <td>Use debug mode to see more clearly what AutoDLL is doing.</td>
        </tr>
        <tr>
            <td>plugins</td>
            <td>Array</td>
            <td><code>[]</code></td>
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
        <tr>
          <td>inherit</td>
          <td>Boolean/Function</td>
          <td><code>false</code></td>
          <td>
            Inherit from the parent config.
            A valid use-case would be if you have <code>devtool: "source-maps"</code> in your webpack config and wanted source maps to be created for the DLL bundle as well.
            However, this <strong>does not</strong> inherit plugins from the parent config and inheriting loaders are buggy too(see <a href="https://github.com/asfktz/autodll-webpack-plugin/issues/37">#37</a>).
            It can also be a function to inherit only the desired properties.
            <pre>function inherit(webpackConfig) {
  // Return object with desired properties.
}
</pre>
            To see it action, <a href="https://github.com/asfktz/autodll-webpack-plugin/tree/master/experiments/inherit">check out the example</a>.
            <br>
            <strong>⚠️ This option is highly experimental! Use with caution and if you face any problems, please open a issue.<strong>
          </td>
        </tr>
    </tbody>
</table>

## FAQ

### I added my dependencies to the DLL, and now, when I make a change to one of them I don't see it! Why?

When you run webpack for the first time, AutoDLL builds the DLL bundles and stores them in the cache for next time.

That leads to faster builds and rebuilds (using webpack's dev server).

There are two conditions for triggering a new build on the next run:
1. Running `npm install / remove / update package-name` (or Yarn equivalent).
2. Changing the plugin's configurations.

For performance considerations, AutoDLL is not aware of any changes made to module's files themselves.

So as long as you intend to work on a module, just exclude it from the DLL.

For example, let's say you configured the plugin like so:

```js
new AutoDllPlugin({
  entry: {
    vendor: [
      'react',
      'react-dom',
      'lodash'
    ]
  }
})
```

And then, while working on your project, you encountered some weird behavior with `lodash` and decided to put a `console.log` statement in one of its files to see how it behaves.

As explained above, AutoDLL is not going to invalidate its cache in this case, and you might get surprised that you don't see the changes.

To fix that, all you have to do is comment out `lodash` from the DLL, and uncomment it when you're done.

```js
new AutoDllPlugin({
  entry: {
    vendor: [
      'react',
      'react-dom'
     // 'lodash'
    ]
  }
})
```


### The modules I added to the DLL are duplicated! They included both in the DLL bundle AND the main bundle.

That is most likely caused by using an incorrect context.

AutoDLL will try its best to set the context for you, but as with [webpack's own context](https://webpack.js.org/configuration/entry-context/#context) property, sometimes it is better to do it manually.

The context property should be an absolute path, pointing the base of your project.

For example, let's consider a project structured like so:

```
my-project
├── node_modules
│   └── react
│   └── react-dom
├── src
│   └── index.js
│   └── module.js
├── webpack.config.js
└── package.json
```

Then, inside `webpack.config.js`, You'll setup the context like so:

```js
__dirname;   // '/Users/username/my-project'

...

new AutoDllPlugin({
  context: __dirname,
  entry: {
    vendor: [
      'react',
      'react-dom'
    ]
  }
})
```

Note that the `__dirname` variable is [node's way](https://nodejs.org/docs/latest/api/globals.html#globals_dirname) to get the absolute path of the current module's directly, which is exactly what we need because webpack.config.js stored in the base of our project.

On the other hand, let's say your project is structured like so:

```
my-project
├── node_modules
│   └── react
│   └── react-dom
├── src
│   └── index.js
│   └── module.js
├── config
│   └── webpack.config.js
└── package.json
```

Notice that now our config is no longer stored at the base of our project, but in a subdirectory of its own. <br>
That means that now we have to subtract the relative path to our config file from `__dirname`.

We can use [node's path module](https://nodejs.org/docs/latest/api/path.html) to help us with that:

```js
var path = require('path');

__dirname;                   // '/Users/username/my-project/config'
path.join(__dirname, '..');  // '/Users/username/my-project'

...

new AutoDllPlugin({
  context: path.join(__dirname, '..'),
  entry: {
    vendor: [
      'react',
      'react-dom'
    ]
  }
})
```

If you still encounter an issue with the context set up correctly, please open an issue. I'll be happy to help you.

## Running Examples

1. `git clone git@github.com:asfktz/autodll-webpack-plugin.git`
2. `cd autodll-webpack-plugin`
3. `npm install`
4. `npm run build`
5. `cd examples/recommended`
6. `npm install`
7. `npm start` or `npm run build`

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars1.githubusercontent.com/u/199747?v=4" width="100px;"/><br /><sub>Asaf Katz</sub>](https://twitter.com/asfktz)<br />[💻](https://github.com/asfktz/autodll-webpack-plugin/commits?author=asfktz "Code") [👀](#review-asfktz "Reviewed Pull Requests") [⚠️](https://github.com/asfktz/autodll-webpack-plugin/commits?author=asfktz "Tests") [🚇](#infra-asfktz "Infrastructure (Hosting, Build-Tools, etc)") | [<img src="https://avatars2.githubusercontent.com/u/22251956?v=4" width="100px;"/><br /><sub>Suhas Karanth</sub>](https://github.com/sudo-suhas)<br />[💻](https://github.com/asfktz/autodll-webpack-plugin/commits?author=sudo-suhas "Code") [🤔](#ideas-sudo-suhas "Ideas, Planning, & Feedback") [🐛](https://github.com/asfktz/autodll-webpack-plugin/issues?q=author%3Asudo-suhas "Bug reports") [🚇](#infra-sudo-suhas "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/asfktz/autodll-webpack-plugin/commits?author=sudo-suhas "Tests") [🔧](#tool-sudo-suhas "Tools") [💬](#question-sudo-suhas "Answering Questions") | [<img src="https://avatars1.githubusercontent.com/u/583657?v=4" width="100px;"/><br /><sub>Jonas Pauthier</sub>](https://twitter.com/jonas_pauthier)<br />[🤔](#ideas-Nargonath "Ideas, Planning, & Feedback") [🔧](#tool-Nargonath "Tools") [💬](#question-Nargonath "Answering Questions") [📖](https://github.com/asfktz/autodll-webpack-plugin/commits?author=Nargonath "Documentation") [🐛](https://github.com/asfktz/autodll-webpack-plugin/issues?q=author%3ANargonath "Bug reports") | [<img src="https://avatars1.githubusercontent.com/u/9636410?v=4" width="100px;"/><br /><sub>Ade Viankakrisna Fadlil</sub>](https://musify.id)<br />[💻](https://github.com/asfktz/autodll-webpack-plugin/commits?author=viankakrisna "Code") [🐛](https://github.com/asfktz/autodll-webpack-plugin/issues?q=author%3Aviankakrisna "Bug reports") [🔧](#tool-viankakrisna "Tools") [💬](#question-viankakrisna "Answering Questions") | [<img src="https://avatars2.githubusercontent.com/u/2373958?v=4" width="100px;"/><br /><sub>Tryggvi Gylfason</sub>](https://github.com/tryggvigy)<br />[💻](https://github.com/asfktz/autodll-webpack-plugin/commits?author=tryggvigy "Code") [💬](#question-tryggvigy "Answering Questions") [🐛](https://github.com/asfktz/autodll-webpack-plugin/issues?q=author%3Atryggvigy "Bug reports") | [<img src="https://avatars1.githubusercontent.com/u/1056587?v=4" width="100px;"/><br /><sub>Drew Hamlett</sub>](https://github.com/drewhamlett)<br />[💻](https://github.com/asfktz/autodll-webpack-plugin/commits?author=drewhamlett "Code") | [<img src="https://avatars1.githubusercontent.com/u/8420490?v=4" width="100px;"/><br /><sub>Joshua Wiens</sub>](https://github.com/d3viant0ne)<br />[📖](https://github.com/asfktz/autodll-webpack-plugin/commits?author=d3viant0ne "Documentation") [💬](#question-d3viant0ne "Answering Questions") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars2.githubusercontent.com/u/231804?v=4" width="100px;"/><br /><sub>Daniel Tschinder</sub>](https://github.com/danez)<br />[💻](https://github.com/asfktz/autodll-webpack-plugin/commits?author=danez "Code") | [<img src="https://avatars1.githubusercontent.com/u/6374832?v=4" width="100px;"/><br /><sub>Amila Welihinda</sub>](http://amilajack.com)<br />[📖](https://github.com/asfktz/autodll-webpack-plugin/commits?author=amilajack "Documentation") |
<!-- ALL-CONTRIBUTORS-LIST:END -->
This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

Special thanks to all the contributors over the time.
Every one of you made an impact ❤️

