# 定制开发项目模板

有了前面几篇文章的铺垫，我相信我们回过头来再看看用 `vue-cli` 脚手架工具初始化的项目，就很好理解了。本篇将带着大家全面认识下用 `vue-cli` 脚手架工具初始化的项目，并会讲解如何定制化自己的项目模板。

<!--more-->

## 初始化项目

先全局安装 [vue-cli](https://github.com/vuejs/vue-cli) 脚手架工具：

```bash
npm install -g vue-cli
```

安装完成后，初始化基于 `webpack` 的项目模板，按照指示依次填写项目信息和选择需要的模块：

```bash
$ vue init webpack vue-pro-demo

? Project name vue-pro-demo
? Project description A Vue.js project
? Author yugasun <yuga_sun@163.com>
? Vue build standalone
? Install vue-router? Yes
? Use ESLint to lint your code? Yes
? Pick an ESLint preset Airbnb
? Set up unit tests No
? Setup e2e tests with Nightwatch? No
? Should we run `npm install` for you after the project has been created? (recommended) npm

   vue-cli · Generated "vue-pro-demo".


# Installing project dependencies ...
# ========================
...

# Project initialization finished!
# ========================

To get started:

  cd vue-pro-demo
  npm run dev

Documentation can be found at https://vuejs-templates.github.io/webpack
```

执行完成后，当前目录下就会生成命名为 `vue-pro-demo` 的项目文件夹，结构如下：

```bash
.
├── README.md           # 项目说明文件
├── build               # 存放webpack 构建文件
├── config              # 存放webpack 配置文件
├── index.html          # 项目html模板文件
├── package.json        # 存储项目包依赖，以及项目配置信息
├── src                 # 开发文件夹，一般业务代码都在这里写
└── static              # 项目静态资源文件夹

4 directories, 4 files
```

对于 `src` 目录，我们在开发中也会根据文件的功能进行文件夹拆分，比如我个人比较喜欢的结构如下（仅供参考）：

```bash
.
├── App.vue             # 项目如何组件
├── api                 # 存放接口相关文件
├── assets              # 存放项目资源文件，比如图片
├── components          # 存放通用组件
├── directive           # 存放全局自定义指令
├── filters             # 存放全局过滤器
├── main.js             # 项目入口文件
├── mock                # mock数据
├── router              # 路由
├── store               # 状态管理
├── styles              # 样式文件
├── utils               # 存放工具函数
└── views               # 存放视图类组件
```

规范的目录结构可以很好的规范化你的开发习惯，代码分工明确，便于维护，当你把锅甩给别人时，别人也不至于太难受，这个体会我想大家都懂的，脏话不宜说太多o(╯□╰)o。

## 定制开发项目模板

每个人在使用官方项目模板开发项目的时候，都或多或少的会修改一些默认的 `webpack` 配置，然后添加一些项目经常使用的的插件，也会根据自己需要在 `src` 目录下添加一些通用的文件夹目录，比如上面所说到的。

这就存在一个问题，每次我们在初始化项目的时候，都需要重复完成这几项操作，作为一个懒癌晚期患者的程序员，又怎么能容忍此类事情发生呢？所以定制化的需求蠢蠢欲动了。

下面就介绍下如何对官方的 [webpack模板](https://github.com/vuejs-templates/webpack) 进行二次开发。

### 二次开发

要做到这点，只需要三步：

1. Fork官方源码 [vuejs-templates/webpack](https://github.com/vuejs-templates/webpack)
2. 克隆到本地二次开发，添加自己想要的配置和插件，并 push 到 github
3. 初始化项目时，使用我们自己的仓库就行

对于步骤1，会使用github的朋友应该都没问题，但是希望你不要问我，复制一个项目为什么叫 `fork - 叉子`，更不要看成 `f**k`。随便搜索下就明白了。

接下来，重点介绍下步骤2。

克隆项目[vuejs-templates/webpack](https://github.com/vuejs-templates/webpack)到我们的本地后，你会发现目录结构是这样的：

```bash
.
├── LICENSE
├── README.md
├── deploy-docs.sh
├── docs
├── meta.js
├── package-lock.json
├── package.json
├── scenarios
├── template
└── utils
```

这里我们只需要关心 `template` 目录就够了，因为这个目录存放的就是我们的项目模板。

打开 `template/src/main.js` 文件（项目入口文件），代码如下：

```js
@@#if_eq build "standalone"@@
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
@@/if_eq@@
import Vue from 'vue'
import App from './App'
@@#router@@
import router from './router'
@@/router@@

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  @@#router@@
  router,
  @@/router@@
  @@#if_eq build "runtime"@@
  render: h => h(App)
  @@/if_eq@@
  @@#if_eq build "standalone"@@
  components: { App },
  template: '<App/>'
  @@/if_eq@@
})
```

> 由于hexo对含有 `handlebars` 语法的演示代码编译有问题，所以将花括号进行了修改 `{ -> @, } -> @`，请结合实际源代码进行阅读。

其中包含了很多 [handlebars](https://github.com/wycats/handlebars.js) 的语法，这里主要用到了 `if` 条件判断语法，也很好理解。

好了，现在开始添加一个 [vue-axios-plugin](https://github.com/yugasun/vue-axios-plugin) 模块，步骤如下：

1. 在 `template/package.json` 的 `dependencies` 字段中添加 `vue-axios-plugin` 依赖：

  ```js
  //....
    "dependencies": {
      "vue-axios-plugin": "@1.2.3",
      "vue": "@2.5.2"@@#router@@,
      "vue-router": "@3.0.1"@@/router@@
    },
  //...
  ```

  > 这里 `@@#router@@` 是用来判断初始化的时候你是否选择使用 `vue-router`，如果不选择，就会根据判断移除 `vue-router` 依赖，很好理解吧。但是需要特别注意的就是，这里`"vue": "@2.5.2"` 末尾的那个逗号（ `,` ）也会被移除，所以你在添加自定义依赖后，一定要注意当此类情况发生时，保证初始化后，你项目的 `package.json` 文件格式是否合法有效。

2. 在 `template/src/main.js` 中添加插件注入代码：

  ```js
  @@#if_eq build "standalone"@@
  // The Vue build version to load with the `import` command
  // (runtime-only or standalone) has been set in webpack.base.conf with an alias.
  @@/if_eq@@
  import Vue from 'vue'
  import VueAxiosPlugin from 'vue-axios-plugin'
  import App from './App'
  @@#router@@
  import router from './router'
  @@/router@@

  Vue.use(VueAxiosPlugin)

  Vue.config.productionTip = false
  // ...
  ```

### 本地测试使用

好了，这样我们的自定义组件已经添加完成了，那么在提交之前，我们还需要先测试下修改后的模板是否有效，运行命令进行初始化：

```bash
vue init path/to/webpack-template my-project
```

这里 `vue init` 的第一个参数 `path/to/webpack-template` 就是当前修改后的模板路径，之后还是重复交互式的配置过程，然后运行你的项目就行了。

不出意外地话，你的项目会很顺利的 `npm run dev` 跑起来，之后我们只需要 `push` 到我们自己的 `github` 仓库就行了。

### 使用

提交以后，项目同事都可以共享这份模板了，用的时候只需要运行以下命令：

```bash
vue init yugasun/webpack my-project
```

> 这里的 `yugasun/webpack` 参数就是告诉 `vue-cli` 在初始化的时候到用户 `yugasun` 的 github 仓库下载 `webpack` 项目模板。

之后你就可以愉快的编写输出你的 `Hello world` 了。

### 补充说明

当你你足够熟悉项目模板，你也可以对 `webpack` 配置进行更个性化的配置，或者添加 `vue init` 时的交互式命令。感兴趣的可以参看下我的个人模板 [yugasun/webpack](https://github.com/yugasun/webpack)。

## 总结

第二章有关项目配置篇，到这里就结束了，希望通过这一章的讲解，能够帮助大家了解到，一个完整的前端项目结构是如何实现的。从最基本的标签引入开始到工程化的项目架构，我尽量做到用最傻瓜式的方式来讲解，就是希望即使一个前端新手，也可以很轻松的实现自己工程化的项目配置。重点还是贵在多练习，多总结。

[源码在此](https://github.com/yugasun/webpack)

## 专题目录

[You-May-Not-Know-Vuejs](https://github.com/yugasun/You-May-Not-Know-Vuejs#%E6%96%87%E7%AB%A0%E7%9B%B4%E9%80%9A%E8%BD%A6)
