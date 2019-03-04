---
title: 你也许不知道的Vuejs - 工欲善其事必先利其器
desc: 关于Vuejs项目实战经验分享，一步一步带你学会用Vuejs框架开发项目。
reward: true
date: 2018-02-06 21:00:00
tags:
  - Vuejs
  - You-May-Not-Know-Vuejs
---

> by [yugasun](https://yugasun.com) from [https://yugasun.com/post/you-may-not-know-vuejs-5.html](https://yugasun.com/post/you-may-not-know-vuejs-5.html)
本文可全文转载，但需要保留原作者和出处。


## 开发环境

既然是实战，怎离不开项目开发的环境呢？先给大家推荐下我的个人开发环境：

> **硬件设备**：Mac OSX
> **编译器**：Visual Studio Code
> **命令行工具**：iTerm2
> **调试工具**：Chrome Dev tool + vue-devtools
> **版本管理**：Git

<!--more-->

具体工具的操作界面和如何使用，这里就不展示了。随便用搜索引擎搜索，就是相关介绍。大家可以根据个人喜好，来选择适合你的开发环境。

## 模块化开发

前面的文章中使用 Vue，都是直接引入源码方式来使用，但是实际开发中项目一般很复杂，并且会涉及到很多页面模板，不可能所有的功能我们都写在同一个js文件，然后在通过 script 标签引入，这样项目大了会越来越不易维护，所以项目需要模块化开发。

> 关于什么事模块化，具体如何模块化构架我们的项目，推荐阅读 [JavaScript 模块化入门Ⅰ：理解模块](https://zhuanlan.zhihu.com/p/22890374) 和 [JavaScript 模块化入门Ⅱ：模块打包构建](https://zhuanlan.zhihu.com/p/22945985)。

当项目代码多了，我们的模块文件越来越多，就需要工具来帮助我们更好的管理和打包这些模块，让我们能更好的关注模块化开发，而不是这些琐碎的事情。于是 `webpack` 类似的工具就应运而生，当然除了 `webpack` 还有很多类似的工具，他们各有各的优点，比如：[rollup](https://github.com/rollup/rollup)、[parcel](https://github.com/parcel-bundler/parcel)...。

今后文章所有的实例将用到 `webpack` 的 `3.x` 版本工具来结合Vue 完成开发工作。

## 初始 webpack

这里不得不说一下，很多朋友在开发 Vue 项目的时候，一上来就使用 [vue-cli](https://github.com/vuejs/vue-cli) 脚手架工具开发项目，虽然可以很快的构建项目模板，不用关注初始化配置问题。但是我不建议这么做，因为一上来就是 `vuejs + webpack + es6 + babel + eslint...` 等各种工具，有人都还不知道他们是什么，就开始用。出了问题，就不知道如何是好。虽然借助搜索引擎可以帮助我们解决80%的难题，但还是需要花费大量的精力去搜索查询，不断的尝试，等问题解决了，一天就过去了，得不偿失啊。

所以我建议先从学会使用 `webpack` 开始，一步一步的引入进来，会容易接受一些。毕竟这世界上大多数人都不是天才，要学会跑，得先学会走路。

> 虽然当前社会比较浮躁，但是拥有一颗宁静的心，脚踏实地，才是成功之道啊~

好了废话不多说，直接进入今天的正题，**使用 webpack 愉快的进行 Vuejs 项目开发**。

> 在阅读下面代码之前，请提前熟悉 nodejs 模块的使用，包括基本的通过 npm 安装模块依赖和如何引入第三方模块使用，这里虽然会提到，但不会详细解释。

我们先新建一个项目文件夹，在根目录下新建 `index.html`，代码如下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Vue webpack demo</title>
</head>
<body>
  <div id="app"></div>
  <script src="./build.js"></script>
</body>
</html>
```

命令行运行  `npm init`，按照交互提示，填写项目相关信息（当然都是英文，不懂得直接翻一下就明白了），填写完成后，项目根目录下会出现 `package.json` 文件（关于package.json文件内容具体介绍，可以阅读这篇文章：[package.json文件](http://javascript.ruanyifeng.com/nodejs/packagejson.html)）。然后通过 `npm` 安装我们需要的 `vue` 库：

```bash
# 添加 --save 参数，会将 vue 依赖添加到 package.json 文件中
npm install vue --save
```

然后新建一个 `src` 目录，在 `src` 目录下创建一个 `app.js` 入口文件，代码如下：

```js
// 模块化的引入 vue，并将其赋值给 Vue 变量
var Vue = require('vue')

new Vue({
  el: "#app",
  template: "<h1>{{ msg }}</h1>",
  data () {
    return {
      msg: 'Hello Vue.js'
    }
  }
})
```

当然 `require` 函数浏览器是无法识别的，这是就需要通过 `webpack` 帮我们实现编译打包工作，转化为主流浏览器可是别的 ES5 代码。

先安装 `webpack` 包依赖：

```bash
# 添加 --save-dev 参数，会将 webpack 开发依赖添加到 package.json 文件中
npm install webpack --save-dev
```

然后在项目根目录下创建 `webpack.config.js` 文件，代码如下：

```js
module.exports = {
  // 入口文件
  entry: './src/app.js',
  // 编译输出文件
  output: {
    filename: 'build.js'
  },
  resolve: {
    alias: {
      // 因为我们这里用的是 require 引入方式，所以应该使用vue.common.js/vue.js/vue.min.js
      'vue$': 'vue/dist/vue.common.js'
    }
  }
}
```

因为上面的 `index.html` 中引入的是编译后的 `build.js` 文件，要看到开发效果，就需要手动运行 `webpack` 打包命令：

```bash
./node_modules/.bin/webpack
```

> 这里如果你想直接运行 `webpack`，那么就需要你的电脑全局安装 webpack，可以通过运行 `npm install webpack -g` 命令来全局安装。

然后你会看到输出以下结果：

```bash
$ webpack
Hash: 8a61c2605578f38f46cd
Version: webpack 3.10.0
Time: 386ms
   Asset    Size  Chunks             Chunk Names
build.js  104 kB       0  [emitted]  main
   [0] (webpack)/buildin/global.js 509 bytes {0} [built]
   [1] ./src/app.js 148 bytes {0} [built]
    + 4 hidden modules
```

此时根目录下就会出现 `build.js` 文件，我们再通过浏览器打开 `index.html` 文件，熟悉的画面出现了，`Hello Vue.js`。

到这里一个简单的基于 `vue + webpack` 的项目就构建完成了，是不是很简单，迫不及待想自己动手试试呢？当然 `webpack` 的功能远不止如此更详细的功能，请阅读 [官方文档](https://doc.webpack-china.org/concepts/)，全面的了解下 `webpack` 的强大。

## 实时重新加载(live reloading)

上面的例子还有个问题，就是每次我们更新了代码，就需要重新进行打包编译，并手动刷新浏览器，才能看到我们更改的效果，实在是太麻烦了。webpack 作者也考虑到了这个问题，于是同时开发了 `webpack-dev-server` 工具，来帮助我们实现 `live reloading` 的功能，也就是当我们更新代码时，浏览器会实时刷新，呈现更新后的效果。

赶紧用起来~ 先安装下依赖：

```bash
npm install webpack-dev-server --save-dev
```

然后修改 `webpack.config.js` 配置文件如下：

```js
module.exports = {
  // 入口文件
  entry: './src/app.js',
  // 编译输出文件
  output: {
    filename: 'build.js'
  },
  resolve: {
    alias: {
      // 因为我们这里用的是 require 引入方式，所以应该使用vue.common.js/vue.js/vue.min.js
      'vue$': 'vue/dist/vue.common.js'
    }
  },

  // 这里添加的是有关 webpack-dev-server 的配置
  devServer: {
    // 这里定义 webpack-dev-server 开启的web服务的根目录
    contentBase: './'
  }
}
```

然后执行命令：

```bash
./node_modules/.bin/webpack-dev-server
```

控制台会输出一下内容：

```bash
$ ./node_modules/.bin/webpack-dev-server
Project is running at http://localhost:8080/
webpack output is served from /
Content not from webpack is served from ./
Hash: d33155f6797f2c78c448
Version: webpack 3.10.0
Time: 903ms
   Asset    Size  Chunks                    Chunk Names
build.js  627 kB       0  [emitted]  [big]  main
   [0] (webpack)/buildin/global.js 509 bytes {0} [built]
   [3] multi (webpack)-dev-server/client?http://localhost:8080 ./src/app.js 40 bytes {0} [built]
   [4] (webpack)-dev-server/client?http://localhost:8080 7.91 kB {0} [built]
   ...
  [28] ./node_modules/timers-browserify/main.js 1.9 kB {0} [built]
    + 15 hidden modules
webpack: Compiled successfully.
```

打开浏览器，访问： http://localhost:8080，此时我们熟悉的画面又出现了，O(∩_∩)O~~。我们再尝试修改 `app.js` 中 `msg` 内容，浏览器的内容也会跟着变化，是不是很酷，赶紧动手试试吧。

## 使用 npm 脚本

针对上面的打包命令 `./node_modules/.bin/webpack` 和实时开发命令 `./node_modules/.bin/webpack-dev-server`，虽然你可以很快的在命令行复制粘贴输入，但是第一次还是免不了动手输入。作为一个懒惰的程序员，怎么能接受敲击这么多多余的字符呢？正好`package.json` 文件中 `scripts` 字段就可以帮助我们解决这个烦恼。

先来看下介绍：

> scripts 是用来指定运行脚本命令的npm命令行缩写的，比如 start 指定了运行 `npm run start` 时，所要执行的相关命令。

好的，既然明白了它的作用，我们就来尝试改写 `package.json` 文件，修改 `scripts` 字段为如下内容：

```json
"scripts": {
  "dev": "webpack-dev-server",
  "build": "webpack"
}
```

然后，在命令行输入：

```bash
npm run dev
```

你会发现跟执行 `./node_modules/.bin/webpack-dev-server` 是一样的效果。

> 注意：这里在 `scripts` 中指定 `webpack-dev-server` 命令是，省去了命令路径，这是因为，npm 在执行脚本时，会默认优先执行当前目录下 `./node_modules/.bin/` 中的命令，如果找不到该命令，则会执行全局命令。

同理，执行 `npm run build` 就是打包输出我们想要的 `build.js` 文件。

## CSS预处理器

虽然 css 已经足够强大，但是在程序员眼里，它一直是个很麻烦的东西，它没有变量，也没有条件语句，只是单纯的一行行的描述，写起来相当麻烦。于是各种 [CSS预处理器](https://www.catswhocode.com/blog/8-css-preprocessors-to-speed-up-development-time) 应运而生，其中我最喜欢的是 [SASS](http://sass-lang.com/)，使用 sass 语法编写我们的样式文件，会大大提高我们的开发效率，使得 css 工程化变得容易了很多。

接下来介绍下，如何集成到我们的项目中。

对于 webpack 来说 `一切皆模块`，所有的文件通过模块引入的方式形成依赖关系，而对于每个模块的引入或预处理，都是通过 `loader` 来实现了。因为我们的 `sass` 语法浏览器是无法识别的，所以在引入时需要使用相关 `loader` 对其进项预处理，转化为相应的 `css`。虽然 css 浏览器可以识别的，但是 `webpack` 本质上是一个 javascript 应用程序的静态模块打包器，一切文件内容都将处理为 javascript，然后进行后期的处理。所以这里除了需要预处理 `sass` 的 `loader`，还需要加载 `css` 的 `loader`，最后还需要通过 `style-loader` 来转化为通过 js 的方式动态创建 `style` 标签到 `index.html` 中。

知道了这点，我们就知道要怎么做了，首先安装所需的 `loader`:

```bash
# 因为 `sass-loader` 需要依赖 `node-sass`, 所以这里一并安装
npm install style-loader css-loader sass-loader node-sass --save-dev
```

修改 `webpack.config.js` 配置文件，添加相关 `loader` 配置：

```js
module.exports = {
  //...
  module: {
    // 这里用来配置处理不同后缀文件所使用的loader
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  }
}
```

> webpack 的 loader 是支持链式传递的，它能够对资源使用流水线(pipline)式处理，一组链式的 loader 将按照相反顺序依次处理，这里的处理流程就是：
> sass-loader -> css-loader => style-loader

配置好了，我们现在来测试下，在 `src` 目录下创建一个 `app.scss` 文件，内容如下：

```scss
$red: rgb(218, 42, 42);

h1 {
  color: $red;
}
```

然后在 `src/app.js` 文件中引入：

```js
require('./app.scss');

var Vue = require('vue');

new Vue({
  el: "#app",
  template: "<h1>{{ msg }}</h1>",
  data () {
    return {
      msg: 'Hello Vue.js'
    }
  }
});
```

此时再运行 `npm run dev`，你会发现我们的 `h1` 标签颜色变了。通过审核元素，可以发现 `index.html` 的 `head` 标签中新增了一个 `style` 标签，内容就是，`app.scss` 编译输出的内容：

```css
h1 {
  color: #da2a2a;
}
```

如果还不清楚 `sass` 用法的，建议去看看这篇基础介绍文档：[SASS用法指南](http://www.ruanyifeng.com/blog/2012/06/sass.html)

## 图片加载

既然说到了 css 静态资源，自然免不了对于图片的加载了。上文说过，在 webpack 中，一切皆模块，图片当然也是以模块的方式引入的。既然是模块，自然少不了相关引入的 loader，这里图片引入我们使用到的是 `url-loader`，先安装下：

```bash
npm install url-loader --save-dev
```

添加 `url-loader` 配置：

```js
module.exports = {
  // ...
  module: {
    // 这里用来配置处理不同后缀文件所使用的loader
    rules: [
      // ...
      {
        test: /\.(jpe?g|gif|png)$/,
        use: 'url-loader'
      }
    ]
  }
}
```

然后再 `app.js` 中引入：

```js
require('./app.scss');

var Vue = require('vue');
var logoSrc =  require('./logo.jpg')

new Vue({
  el: "#app",
  data () {
    return {
      msg: 'Hello Vue.js'
    }
  },
  render (h) {
    return (
      h('div', [
        h('img', {
          domProps: {
            src: logoSrc,
            alt: 'logo',
            className: 'logo'
          }
        }),
        h('h1', this.msg)
      ])
    )
  }
});
```

> 这里我们用 `render` 函数来自定义渲染我们的节点，它含有默认参数 `h` 就是我们 [花式渲染目标元素](https://yugasun.com/post/you-may-not-know-vuejs-1.html) 讲到的 `createElement` 参数的别名而已，这里为了书写简单。`h` 函数的第一个参数为 `dom` 名称，第二个参数为创建时配置对象，通过 `domProps` 来添加 DOM 相关的属性值。这里将我们引入的 `logoSrc` 赋值给它的 `src` 属性。

然后再重新运行 `npm run dev`，页面中就出现了我们想要的 `logo` 图片了。

## 总结

`知己知彼，百战不殆`，我们只有真正了解了 `webpack` 的使用技巧，在实际开发中，我们才会更加的得心应手。不至于被一个莫名其妙的错误个吓到。程序员有三宝：`多学习，多编写，多总结`，我们的编程技巧才能才会不断提高。

[源码在此](https://github.com/yugasun/You-May-Not-Know-Vuejs/blob/master/chapter2/1)

## 专题目录

[You-May-Not-Know-Vuejs](https://github.com/yugasun/You-May-Not-Know-Vuejs#%E6%96%87%E7%AB%A0%E7%9B%B4%E9%80%9A%E8%BD%A6)
