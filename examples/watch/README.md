# AutoDllPlugin Watch Example

### How to install

1. `git clone git@github.com:asfktz/autodll-webpack-plugin.git`
2. `cd examples/watch`
3. `npm install`
4. `npm run`
5. `open http://localhost:8080`


### How to use

1. Close devServer using ctrl + C
2. Rerun the devServer using `npm start` to verify that cache is working
3. Modify something in node_modules or package.json
4. Close devServer using ctrl + C
5. Rerun devServer using `npm start`
6. You'll see that DLL is recompiling, cache is invalidated, and your changes should be included in the DLL bundle.
7. Repeat