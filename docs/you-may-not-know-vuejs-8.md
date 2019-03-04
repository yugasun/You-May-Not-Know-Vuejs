---
title: 你也许不知道的Vuejs - 使用ESLint检查代码质量
desc: 关于Vuejs项目实战经验分享，一步一步带你学会用Vuejs框架开发项目。
reward: true
tags:
  - Vuejs
  - You-May-Not-Know-Vuejs
date: 2018-03-13 18:19:16
---

> by [yugasun](https://yugasun.com) from [https://yugasun.com/post/you-may-not-know-vuejs-8.html](https://yugasun.com/post/you-may-not-know-vuejs-8.html)
本文可全文转载，但需要保留原作者和出处。

## 前言

Javascript 是一门弱类型语言，所以语法检查变得尤为重要。虽然有很多前端IDE开发工具，可以很好地帮助我们提示在编写时的错误，但是大多数开发者还是使用的像 `Sublime Text`、`Visual Studio Code` 之类的轻量级编辑器，这导致在开发中很容易出现各种错误，比如单词拼写错误，漏掉了括号等。而且每个人的代码编写习惯也不一样，因此有的项目的代码格式千差万别，比如 `缩进空格数`，有的习惯4个，有的习惯2个，这也导致项目维护起来越来越麻烦，遇到错误也很难定位。因此对 `Javascript` 进行语法检查的工具应运而生，目前 [ESLint](https://eslint.org/) 使用最为广泛。这篇将讲解如何将 `ESLint` 集成到我们的项目中。

<!--more-->

## 配置方式

ESLint 具有高可配置行，这就意味着你可以根据项目需求定制代码检查规则。ESLint 的配置方式可以有以下两种方式：

* 文件注释：在 Javascript 文件中使用注释包裹配置内容。
* 配置文件(**推荐**)：在项目根目录下创建包含检查规则的 `.eslintrc.*` 文件。

## 扩展配置文件

ESLint 配置文件中的 `extends` 字段可以扩展集成现有的规则，比如著名的 [Airbnb JavaScript Style](https://github.com/airbnb/javascript)，可以通过安装 `eslint-config-airbnb-base` 集成使用。

## 开始使用

因为本人比较偏向于 [Airbnb JavaScript Style](https://github.com/airbnb/javascript)，所以今后的代码规范将均使用此规范。并且我们这里是 Vuejs 项目，所以需要同时对 `.vue` 文件中的 js 代码进行检测，就需要利用 `eslint-plugin-vue` 插件来搭配使用。

首先，安装依赖：

```bash
npm install eslint eslint-config-airbnb-base eslint-plugin-import eslint-plugin-vue --save-dev
```

其次，在项目根目录下新建 `.eslintrc.js` 文件，配置如下：

```js
module.exports = {
  extends: [ 'plugin:vue/essential', 'airbnb-base' ],
};
```

最后，在 `package.json` 中添加 `lint` 脚本:

```js
// ...
"scripts": {
  // ...
  "lint": "eslint --ext .js,.vue src"
},
// ...
```

> 当然你也可以全局安装以上依赖，这样你可以直接运行 `eslint --ext .js,.vue src` 命令。

Ok， 配置好了~

命令行运行 `npm run lint`，输出如下：

```bash
$ npm run lint

> vue-webpack-demo@0.0.1 lint /Users/Yuga/Desktop/VueLearning/You-May-Not-Know-Vuejs/chapter2/4
> eslint --ext .js,.vue src

/Users/Yuga/Desktop/VueLearning/You-May-Not-Know-Vuejs/chapter2/4/src/hello1.vue
  17:16  error    Missing trailing comma        comma-dangle
  26:9   warning  Unexpected console statement  no-console
  38:9   warning  Unexpected console statement  no-console

/Users/Yuga/Desktop/VueLearning/You-May-Not-Know-Vuejs/chapter2/4/src/utils.js
  15:3  warning  Unexpected console statement  no-console

✖ 4 problems (1 error, 3 warnings)
  1 error, 0 warnings potentially fixable with the `--fix` option.
```

你会发现检查出一堆错误，___不要方___，输出的错误说明的非常明显，只需要根据错误提示行号去检查，然后根据规则更改就行了。

上面的命令中 `--ext` 参数就是用来指定需要检查的扩展名的文件，`src` 就是指定检查的目录。

## 添加自定义规则

虽然 `Airbnb` 的代码风格已经很成熟了，但是并不是满足任何人需求的。有些时候，如果想修改一些规则怎么办？这时我们可以通过在 `.eslintrc.js` 文件中添加 `rules` 字段来自定义。规则 [no-console](https://eslint.org/docs/rules/no-console) 就是用来规定禁止使用 `console` 来调试程序，`Airbnb` 代码风格在检查是会输出如下警告：

```bash
/Users/Yuga/Desktop/VueLearning/You-May-Not-Know-Vuejs/chapter2/4/src/hello1.vue
  26:9  warning  Unexpected console statement  no-console
```

但是我们有些时候项目经常使用到 `console`，所以我会关闭该条规则，修改 `.eslintrc.js` 文件如下：

```js
module.exports = {
  extends: [ 'plugin:vue/essential', 'airbnb-base' ],
  rules: {
    'no-console': 'off',
  }
};
```

这样在运行 `npm run lint` 时，命令行就不会输出 `no-console` 警告了。

> 有关 ESLint 的基础教程请阅读 [ESLint](http://javascript.ruanyifeng.com/tool/lint.html)，关于 `Airbnb` 代码规范，请阅读 [Airbnb JavaScript Style](https://github.com/airbnb/javascript)。

## 总结

读完你会发现，之前自己一直不敢使用的 `ESLint` 是如此的简单，无论是安装还是配置，非常的人性化。

作为一名优秀的程序员，规范化的代码风格尤为重要，这不仅能降低代码出错率，而且非常有益于别人阅读你的代码。说到代码阅读，代码注释也是必不可少的。俗话说 `己所不欲，勿施于人`，如果你不想阅读 `shit` 一样的代码，那么就先从自身做起，赶紧在你的项目中实践起来吧~

[源码在此](https://github.com/yugasun/You-May-Not-Know-Vuejs/blob/master/chapter2/4)

## 专题目录

[You-May-Not-Know-Vuejs](https://github.com/yugasun/You-May-Not-Know-Vuejs#%E6%96%87%E7%AB%A0%E7%9B%B4%E9%80%9A%E8%BD%A6)
