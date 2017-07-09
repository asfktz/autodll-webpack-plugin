# Change log

### 0.1.0

##### Bug Fix:

- Multiple AutoDLL's overwrite each other [@viankakrisna](https://github.com/viankakrisna)
- AutoDLL's is not playing nicely with other plugins which integrate with html-webpack-plugin @asfktz

##### Enhancement:
- AutoDll's `.cache` dir now stores each instance files in it's own seperate subdirectory. [@viankakrisna](https://github.com/viankakrisna)
- Context is now defaults to `process.cwd()` [@asfktz](https://github.com/asfktz)

##### Documentation:
- Remove context from examples, use the new default instead [@asfktz](https://github.com/asfktz)

##### Internal:
- Remove unused dependencies #25 [@sudo-suhas](https://github.com/sudo-suhas)
- Fix failing tests for createGetPublicPath on windows(path compare) [#27](https://github.com/asfktz/autodll-webpack-plugin/pull/27)  [@sudo-suhas](https://github.com/sudo-suhas)
- Use make-dir instead of mkdirp #26 [@sudo-suhas](https://github.com/sudo-suhas)
- Run CI tests on multiple node versions in Travis #35 [@sudo-suhas](https://github.com/sudo-suhas) 
- Setup CI [@asfktz](https://github.com/asfktz)

##### Committers:
- Suhas Karanth ([@sudo-suhas](https://github.com/sudo-suhas))
- Ade Viankakrisna Fadlil ([@viankakrisna](https://github.com/viankakrisna))
- Asaf Katz ([@asfktz](https://github.com/asfktz))

---

### 0.0.8
- Set babel target to node 4 instead of current [#19](https://github.com/asfktz/autodll-webpack-plugin/pull/19) [@sudo-suhas](https://github.com/sudo-suhas)
- Setup pre-commit hook with lint-staged and tests [#18](https://github.com/asfktz/autodll-webpack-plugin/pull/18) @sudo-suhas
- delete ./lib and add it to gitignore [#14](https://github.com/asfktz/autodll-webpack-plugin/pull/14) @viankakrisna

##### Committers:
- Suhas Karanth ([@sudo-suhas](https://github.com/sudo-suhas))
- Ade Viankakrisna Fadlil ([@viankakrisna](https://github.com/viankakrisna))

---

### 0.0.7

#####  Bug fix

- AutoDll's ignores `output.publicPath` [@asfktz](https://github.com/asfktz). <br>
  Related to: Is it possible to set path as an absolute path? [#6](https://github.com/asfktz/autodll-webpack-plugin/issues/6)

##### Enhancement
- Absolute Paths are now supported [@asfktz](https://github.com/asfktz)
- You can now pass plugins to the Dll compiler (useful for production builds). <br>
  Related to: Support extra plugins in config (such as UglifyJS) [#4](https://github.com/asfktz/autodll-webpack-plugin/pull/4) [@drewhamlett](https://github.com/drewhamlett)

##### Documentation:
- Docs(readme): Tweaks readme grammar #3 [@d3viant0ne](https://github.com/d3viant0ne)

##### Internal:
- Add eslint, eslint-plugin-react to devDependencies [#12](https://github.com/asfktz/autodll-webpack-plugin/pull/12) 
[@sudo-suhas](https://github.com/sudo-suhas)
- Fix logger creation when showLogs is false [#10](https://github.com/asfktz/autodll-webpack-plugin/pull/10) [@sudo-suhas](https://github.com/sudo-suhas)
- Use del-cli since del is builtin cmd on windows [#11](https://github.com/asfktz/autodll-webpack-plugin/pull/11) [@sudo-suhas](https://github.com/sudo-suhas)
- Create LICENSE [#5](https://github.com/asfktz/autodll-webpack-plugin/pull/5) [@amilajack](https://github.com/amilajack)

##### Committers:
- Amila Welihinda ([@amilajack](https://github.com/amilajack))
- Drew Hamlett ([@drewhamlett](https://github.com/drewhamlett))
- Joshua Wiens ([@d3viant0ne](https://github.com/d3viant0ne))
- Suhas Karanth ([@sudo-suhas](https://github.com/sudo-suhas))
- Asaf Katz ([@asfktz](https://github.com/asfktz))

---

#### 0.0.6

- initial release
