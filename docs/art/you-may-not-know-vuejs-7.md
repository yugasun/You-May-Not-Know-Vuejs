# 使用ES6快乐的玩耍

上一篇中我们已经学会使用 `babel` 将 ES6 转化为 ES5 了，并且展示了一些 ES6 代码，这一篇将重点聊聊 ES6 在 Vuejs 项目中一些部分应用。

## 什么是ES6

摘自 [ECMAScript 6 简介](http://es6.ruanyifeng.com/#docs/intro)：

> 大家习惯将 `ECMAScript 6.0` 简称为 `ES6`，它是 Javascript 语言的下一代标准，它的目标，是使得 Javascript 语言可以用来编写复杂的大型应用程序，成为企业级开发语言。

<!--more-->

说是下一代，其实早在 2015 年 6月就正式发布了（所以又称 `ES2015`），截止今日已经快3年了，很快 ES7/ES8 都要出来了，所以作为前端开发者，学习 ES6 已经是个必然命题了。不要再问有没有必要学习之类的问题了。

关于 ES6 的基础知识，推荐 `阮一峰` 老师的 [ECMAScript 6 入门](http://es6.ruanyifeng.com/)，看完你就会觉得，并不难。至于有些后端的朋友跟我聊到说 ES6 完全不明白，那是因为你们思想还停留在过去 `jQuery` 的时代，那个时候只需要随便复制几段代码，然后写几个 js 函数，就可以搞定很多后端模板页面了，但是今非昔比了，所以如果你们想深入了解前端，做一个全栈工程师，还是静下心来，好好阅读这篇 ES6 教程。代码这东西，不只是需要会用，更重要的是需要知其所以然。就像你一个 python 同事看到一段代码时问我，为啥 JS 引用一个模块时是 `import Vue form 'vue'`，而不是 `from 'vue' import Vue` 一样，这个我是没法解释的，因为ES6语言的规范就是这样的啊~

## 模块的定义和引入

复制一份上一篇中的项目，在 `src` 目录下创建一个 `utils.js` 文件，内容如下：

```js
/**
 * 简单的深拷贝实现，个人经常这么使用
 * 这里obj中不能包含特殊类型值：undefined,NaN,function类型值
 * @param {object} obj
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * log 函数的二次封装，这里只是为了演示
 * @param {any} content
 */
export function log(content) {
  console.log(`[Yuga log]: ${JSON.stringify(content)}`);
}
```

它就是通过 `export` 暴露出了两个工具函数。

修改 `app.js` 代码进行引入使用：

```js
import './styles/app.scss';
import Vue from 'vue';
import userinfo from './info';
import { deepClone } from './utils';
import * as utils from './utils';
import hello1 from './hello1.vue';
import hello2 from './hello2.vue';

new Vue({
  el: "#app",
  template: '<div><hello1 v-bind:info="userinfo"/><hello2/></div>',
  data () {
    return {
      userinfo: deepClone(userinfo)
    }
  },
  components: {
    hello1,
    hello2
  },
  created () {
    // 你会发现这里也同时改变了源原数据 info ，
    // 所以需要用到深拷贝源数据赋值给 data 中的 info
    this.userinfo.name = 'yugasun111'
    utils.log(userinfo)
  }
});
```

上面分别演示了 5 种模块引入方法，无论是哪一种，其实这个要看该模块是如何 `export` 的，对于任何一个 npm 模块，如果它支持 ES6 方式引入，它一般都会使用 `export` 或 `export default` 关键字暴露出一个对象（任何一个js数据类型），只不过 `export default` 指定了默认输出，这样用户就不用阅读接口文档，就可以按照自己需要加载该模块，并修改为自己喜欢的名称来使用。而对于有些模块（如上面的 `utils.js`）可以通过 `export` 关键字来实现多个子模块的输出，这样用户就可以根据个人需要来引入对应的子模块，前提是得知道其内部子模块名称才行。
而 `import 'normalize.css'` 相当于全局引入了，将该模块的所有内容一并引入。

> 更多细节讲解，建议阅读这篇文章： [ES6 Module 的语法](http://es6.ruanyifeng.com/#docs/module)

这点对于 `require` 的引入方式，是没法做到的，而著名的 [tree-shaking](https://doc.webpack-china.org/guides/tree-shaking/) 功能就是依赖 ES6 的这种模块系统。

## 异步编程

> `Promise` 是异步编程的一种解决方案，比传统的解决方案（回调函数）更合理和更强大。它由社区最早提出和实现，ES6 将其写进了语言标准，统一了用法，原生提供了 `Promise` 对象。深入了解`Promise` 可以阅读这篇博文：[异步编程之 Promise](https://yugasun.com/post/async-programming-promise.html)；
> ES2017 标准又引入了 async 函数，是的异步操作变得更加方便。更详细的介绍在这里：[async 函数](http://es6.ruanyifeng.com/#docs/async)。

有的人说有了 `async 函数` 就不再需要 `Promise` 了，我觉得是不对的，因为很多异步模块都是先基于 `Promise` 封装，然后才能经过  `async/await` 函数来操作的。当然把两者结合起来用，可以完成更加强大的异步编程操作，Vuejs 代码也变得更加灵活、简介和强大。

这里既然是 Vuejs 实战，我就不讲它们的基础用法了，来看看如何用在实际项目中吧~

要想在项目中使用 `async/await` 函数，就必须有相关 `babel` 插件来支持，因为 `async/await` 语法属于 ES2017 规范的内容，所以需要引入 `babel-preset-stage-2` 插件来转化，当然还有 `stage-0, stage-1, stage-3` 等，这里参考 `vue-cli` 常用 `stage-2`，直接安装：

```js
npm install babel-preset-stage-2 babel-plugin-transform-runtime --save-dev
```

然后在 `.babelrc` 文件中添加配置：

```json
{
  "presets": [ "env", "stage-2" ],
  "plugins": [
    "transform-runtime"
  ]
}
```

现在我们的语言支持，配置好了，现在开始使用。

上面的代码中，我们的 `userinfo` 是我们通过 `info.js` 硬编码，然后在 `app.js` 中引入，通过 `props` 传递给了 `hello1.vue` 组件，下面我们通过请求接口方式来获取。

先安装 `vue-axios-plugin` 插件，来提供网络请求服务：

```bash
npm install vue-axios-plugin --save
```

然后在 `app.js` 中导入并使用：

```js
// 引入插件
import VueAxiosPlugin from 'vue-axios-plugin';
// 使用插件
Vue.use(VueAxiosPlugin)
```

这样在应用中的组件中都会在 `this` 上绑定一个 `$http` 属性，它由 `get` 和 `post` 方法，具体使用文档：[vue-axios-plugin文档](https://github.com/yugasun/vue-axios-plugin)。

然后在 `hello1.vue` 中创建请求方法 `getUserInfo`，并在 `created` 钩子函数中调用:

```js
// ...
methods: {
  async getUserInfo () {
    try {
      const res = await this.$http.get('http://yapi.demo.qunar.com/mock/4377/userinfo');
      this.info = res.data
    } catch (e) {
      console.log(e);
    }
  }
},
// ...
```

重新运行项目，审核元素，发现成功发起了 `GET` 请求，并显示了接口数据。

> 注意：其实 Vuejs 的 `methods` 属性中所有的方法都可以定义为 `async函数` 来使用，包括 Vuejs 的生命周期函数，比如 `created`。

可以发现使用 `async/await` 语法比使用 `Promise` 的链式语法简洁多了，而且阅读性更强了。

## 高级异步编程

因为本人工作主要是在大数据可视化，经常在绘制某张定制化图形时，需要同时依赖多个接口（`不要问我为什么会有这么多接口？为啥后端不一次性传给我？因为我不想跟他们撕逼，╮(╯▽╰)╭哎`），而且必须在这几个请求都处理完后，才能开始处理数据，多的时候一张图行依赖6个接口，当然我可以在一个 `async函数` 中写6行 `await` 语法的请求，然后逐个处理，但是这样效率太低了，但是这6个请求是可以并行执行的。这时就可以结合 [Promise.all](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) 高级方法来处理。这样我可以同时发起六个请求，然后统一处理接口返回数据。为了方便，这里演示同时请求2个url，多个的是一样的。我们再在 `hello1.vue` 中添加一个 `get2UserInfo` 方法，然后在 `created` 中调用下，更新后的 `hello1.vue` 如下：

```html
<template>
  <div>
    <h1>{{ msg }}</h1>
    <a v-bind:href="info.site">{{ info.name }}</a><br>
    <a v-bind:href="user1.site">{{ user1.name }}</a><br>
    <a v-bind:href="user2.site">{{ user2.name }}</a><br>
  </div>
</template>
<script>
export default {
  name: 'hello1',
  data () {
    return {
      msg: 'Hello Vue.js',
      info: {},
      user1: {},
      user2: {}
    }
  },
  methods: {
    async getUserInfo () {
      try {
        const res = await this.$http.get('http://yapi.demo.qunar.com/mock/4377/userinfo');
        this.info = res.data
      } catch (e) {
        console.log(e);
      }
    },
    async get2UserInfo () {
      try {
        const res = await Promise.all([
          this.$http.get('http://yapi.demo.qunar.com/mock/4377/userinfo1'),
          this.$http.get('http://yapi.demo.qunar.com/mock/4377/userinfo2'),
        ])
        this.user1 = res[0].data;
        this.user2 = res[1].data;
      } catch (e) {
        console.log(e);
      }
    }
  },
  created () {
    this.getUserInfo();
    this.get2UserInfo();
  }
}
</script>
<style lang="scss" scoped>
h1 {
  color: $green;
}
</style>
```

再次运行项目，可以发现页面在初始化的时候同时发起了3个请求，并正常渲染出了接口数据。通过控制台可以看到这三个请求是并行发起的。

> 注意：这里的 `Promise.all()` 的参数是一个函数执行队列，它们会同时发起，然后都请求成功后，会将队列的每个任务的结果组装成一个结果数据，然后返回。

## 总结

其实要把讲ES6讲完，实在是太难了，写本书都很难讲好，我这里只能说是班门弄斧一下，结合我在 Vue 中的相关实践，对相关功能做个简短介绍，希望能起到引导的作用。不太了解的朋友，可以认真阅读下文首提到的阮一峰老师的文章。接下来后面的文章将全部使用 ES6 的语法编写代码。

[源码在此](https://github.com/yugasun/You-May-Not-Know-Vuejs/blob/master/chapter2/3)

## 专题目录

[You-May-Not-Know-Vuejs](https://github.com/yugasun/You-May-Not-Know-Vuejs#%E6%96%87%E7%AB%A0%E7%9B%B4%E9%80%9A%E8%BD%A6)
