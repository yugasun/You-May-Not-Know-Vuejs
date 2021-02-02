# 单文件组件

## 为什么需要单文件组件

在之前的实例中，我们都是通过 `Vue.component` 或者 `components` 属性的方式来定义组件，这种方式在很多中小规模的项目中还好，但在复杂的项目中，下面这些缺点就非常明显了：

> **字符串模板**：缺乏高亮，书写麻烦，特别是 HTML 多行的时候，虽然可以将模板写在 html 文件中，但是侵入性太强，不利于组件解耦分离。  
> **不支持CSS**：意味着当 HTML 和 JavaScript 组件化时，CSS明显被遗漏了  
> **没有构建步骤**：限制只能使用 HTML 和 ES5 JavaScript，而不能使用预处理器。

Vuejs 提供的扩展名为 `.vue` 的 **单文件组件** 为以上所有问题提供了解决方案。

<!--more-->

## 初识单文件组件

还是利用 [工欲善其事必先利其器](https://yugasun.com/post/you-may-not-know-vuejs-5.html) 中的源码，在 `src` 目录下创建 `hello.vue` 文件，内容如下：

```html
<template>
  <h2>{{ msg }}</h2>
</template>
<script>
export default {
  data () {
    return {
      msg: 'Hello Vue.js 单文件组件~'
    }
  }
}
</script>
<style>
h2 {
  color: green;
}
</style>
```

然后在 app.js 中引入使用：

```js
// ES6 引入模块语法
import Vue from 'vue';
import hello from './hello.vue';

new Vue({
  el: "#app",
  template: '<hello/>',
  components: {
    hello
  }
});
```

此时项目是没法运行的，因为 `.vue` 文件 webpack 是没法是别的，它需要对应的 `vue-loader` 来处理才行，而且细心的朋友会发现 `hello.vue` 中用到了 ES6 语法，此时就需要用到相应的语法转化 `loader` 将 ES6 转化成主流浏览器兼容的 ES5 语法，这里就需要用到官方推荐的 `babel` 工具了。先安装需要的 `loader`:

```bash
# hello.vue 文件中使用了 css，所以需要 css-loader 来处理，vue-loader 会自动调用
npm install vue-loader css-loader babel-loader babel-core babel-preset-env --save-dev
```

> 有的人疑惑只是使用 `babel-loader` 为什么还需要安装后面这么多工具呢，这是因为很多工具都是独立的，`loader` 只是为了配合 webpack 使用的桥梁，而这里 `babel-core` 和 `babel-preset-env` 才是实现 ES6 到 ES5 的核心。

我们再修改 `webpack.config.js` 配置如下：

```js
module.exports = {
  // ...
  module: {
    // 这里用来配置处理不同后缀文件所使用的loader
    rules: [
      {
        test: /.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /.js$/,
        loader: 'babel-loader'
      }
    ]
  }
}
```

对于 babel 的配置，我们还需在项目根目录下刚创建 `.babelrc` 文件来配置 Babel presets 和 其他相关插件，内容如下：

```json
{
  "presets": [ "env" ]
}
```

但是虽然虽然都配置好了，项目还是还是会报错，报如下错误：

```bash
ERROR in ./src/hello.vue
Module build failed: Error: Cannot find module 'vue-template-compiler'
```

有人就不高兴了，明明是按照官方提示安装了依赖，并正确的进行配置，为什么还是会报错呢？遇到错误不要怕，先阅读下错误是什么，很容易发现，是因为 `Cannot find module 'vue-template-compiler'`，这是因为 `vue-loader` 在处理 `.vue` 文件时，还需要依赖 `vue-template-compiler` 工具来处理。

> 刚开始我不知道官方为什么没有直接告诉用户需要安装这个依赖，通过阅读 `vue-loader` 才明白其 `package.json` 文件中是将 `vue-template-compiler` 和 `css-loader` 作为 [peerDependencies](https://docs.npmjs.com/files/package.json#peerdependencies)，而 `peerDependencies` 在安装的时候，并不会自动安装（npm@3.0+），只会给出相关警告，所以这个需要我们手动安装的，当然在 `.vue` 文件中如果需要写 CSS，也必须用到 `css-loader`，这个也是在 `peerDependencies` 中。相关讨论：https://github.com/vuejs/vue-loader/issues/1158

知道问题了，直接安装下就可以了：

```
npm install vue-template-compiler css-loader --save-dev
```

再次运行项目，页面中出现了我们的内容，并没报错，ok，大功告成~


## 使用预处理器

我们已经学会在 `.vue` 中写 css 了，那么如果使用 sass 预处理器呢？首先安装上篇文章中提到的模块：

```bash
npm install sass-loader node-sass --save-dev
```

配置只需两步：

1. 修改 `webpack.config.js` 中 `vue-loader` 配置

  ```js
    module.exports = {
      // ...
      module: {
        // 这里用来配置处理不同后缀文件所使用的loader
        rules: [
          {
            test: /.vue$/,
            loader: 'vue-loader',
            options: {
              loaders: {
                // 这里也可以使用连写方式，但是不利于自定义话参数配置
                // scss: 'vue-style-loader!css-loader!sass-loader'
                scss: [
                  {
                    loader: 'vue-style-loader'
                  },
                  {
                    loader: 'css-loader'
                  },
                  {
                    loader: 'sass-loader'
                  }
                ]
              }
            }
          },
          // ...
        ]
      }
    }

  ```

2. 给 `.vue` 文件中的 `style` 标签，添加 `lang="scss"` 属性。

配置完后，就可以再 `.vue` 文件中，愉快地编写 `sass` 语法了。

## 加载全局设置文件

实际开发中，我们在编写 `sass` 文件时，经常会将全局的 scss 变量提取出来，放到一个单独的文件中，但是这样就有个问题，每个需要用到的组件，都需要手动 `@import './styles/_var.scss'` 进来，非常不友好。插件 `sass-resources-loader` 就很好地帮我们解决这个问题，先安装一下：

```js
npm install sass-resources-loader --save-dev
```

然后修改 `webpack.config.js` 文件中 `vue-loader` 相关配置：

```js
  // ...
  {
    test: /.vue$/,
    loader: 'vue-loader',
    options: {
      loaders: {
        scss: [
          {
            loader: 'vue-style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          },
          // 看这里，看这里，看这里
          {
            loader: 'sass-resources-loader',
            options: {
              // 这里的resources 属性是个数组，可以放多个想全局引用的文件
              resources: [resolve('./src/styles/_var.scss')]
            }
          }
        ]
      }
    }
  }
  // ...
```

配置就完成了，我们再来测试下。

在 `src` 目录下分别创建 `hello1.vue` 和 `hello2.vue` 文件：

```html
<!-- hello1.vue -->
<template>
  <h1>{{ msg }}</h1>
</template>
<script>
export default {
  name: 'hello1',
  data () {
    return {
      msg: 'Hello Vue.js 单文件组件~'
    }
  }
}
</script>
<style lang="scss">
h1 {
  color: $green;
}
</style>

<!-- hello2.vue -->
<template>
  <h1>{{ msg }}</h1>
</template>
<script>
export default {
  name: 'hello2',
  data () {
    return {
      msg: 'Hello Vue.js 单文件组件~'
    }
  }
}
</script>
<style lang="scss">
h1 {
  color: $red;
}
</style>
```

然后创建一个 `styles` 目录，并在其中新建存放全局变量的文件 `_var.scss`:

```scss
$green: rgb(41, 209, 41);
$red: rgb(177, 28, 28);
```

接下来，在 `app.js` 中引用两个组件：

```js
import Vue from 'vue';
import hello1 from './hello1.vue';
import hello2 from './hello2.vue';

new Vue({
  el: "#app",
  template: '<div><hello1/><hello2/></div>',
  components: {
    hello1,
    hello2
  }
});
```

重新运行项目就可以了。

## 有作用域的 style

单文件组件中为我们提供了一个非常便利的功能，就是当 `style` 标签添加 `scoped` 属性时，标签内的样式将只作用于当前组件中的元素。

接着上面的例子，运行后会发现 `hello1.vue` 中的 `h1` 颜色并不是想要的 `$green` 色，而是被 `hello2.vue` 中的样式覆盖了。于是分别在 `hello1.vue` 和 `hello2.vue` 的 `style` 标签上添加 `scoped` 属性，如下：

```html
<!-- hello1.vue -->
<style lang="scss" scoped>
h1 {
  color: $green;
}
</style>

<!-- hello2.vue -->
<style lang="scss" scoped>
h1 {
  color: $red;
}
</style>
```

这样一来我们的两个 `h1` 标签颜色都显示正常了。

## 自定义块

在编写某些开源组件时，有时候我们需要同时维护多个组件和组件说明，但是每次修改就要同时修改 `.vue` 和 `.md` 文件，相当麻烦。`.vue` 文件的 **自定义语言块** 功能，就允许我们将 `markdown` 说明同时写进 `.vue` 文件中，然后通过插件将其说明部分单独提取到相应的 `.md` 文件中，这样就可以同时维护说明文档和组件功能了。

比如我们将 `hello1.vue` 文件修改如下：

```html
<docs>
  # 标题
    这是标题内容，[仓库地址](https://github.com/yugasun/You-May-Not-Know-Vuejs)
  ## 子标题
    这是子标题内容
</docs>
<template>
  <h1>{{ msg }}</h1>
</template>
<script>
export default {
  name: 'hello1',
  data () {
    return {
      msg: 'Hello Vue.js 单文件组件~'
    }
  }
}
</script>
<style lang="scss" scoped>
h1 {
  color: $green;
}
</style>
```

然后修改 `webpack.config.js` 配置：

```js
const path = require('path');
// 引入相关插件
const ExtractTextPlugin = require('extract-text-webpack-plugin');

function resolve(dir) {
  return path.resolve(__dirname, dir);
}

module.exports = {
  // 入口文件
  entry: './src/app.js',
  // 编译输出文件
  output: {
    path: resolve('./'),
    filename: 'build.js'
  },
  resolve: {
    alias: {
      // 因为我们这里用的是 require 引入方式，所以应该使用vue.common.js/vue.js/vue.min.js
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  devServer: {
    // 这里定义 webpack-dev-server 开启的web服务的根目录
    contentBase: resolve('./')
  },
  module: {
    // 这里用来配置处理不同后缀文件所使用的loader
    rules: [
      {
        test: /.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: [
              {
                loader: 'vue-style-loader'
              },
              {
                loader: 'css-loader'
              },
              {
                loader: 'sass-loader'
              },
              {
                loader: 'sass-resources-loader',
                options: {
                  resources: [resolve('./src/styles/_var.scss')]
                }
              }
            ],
            docs: ExtractTextPlugin.extract('raw-loader')
          }
        }
      },
      {
        test: /.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('docs.md')
  ]
}
```

这里用到了 `extract-text-webpack-plugin` 导出 `text` 插件，和 `raw-loader`，分别都安装下就行。

然后运行构建命令 `npm run build`，等运行结束，根目录下会同时生成一个 `docs.md` 文件，这就是我们想编写的说明文档。

## 总结

关于 **单文件组件** 就到这里，实际上 `vue-loader` 在处理 `.vue` 文件时，还有很多强大的功能，我们这里只是带着大家感受一般项目中如何使用，同时解释了下相关使用原理说明，更多的功能，建议阅读 [vue-loader官方文档](https://vue-loader.vuejs.org/zh-cn/) 。

[源码在此](https://github.com/yugasun/You-May-Not-Know-Vuejs/blob/master/chapter2/2)

## 专题目录

[You-May-Not-Know-Vuejs](https://github.com/yugasun/You-May-Not-Know-Vuejs#%E6%96%87%E7%AB%A0%E7%9B%B4%E9%80%9A%E8%BD%A6)
