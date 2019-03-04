---
title: 你也许不知道的Vuejs - 插件开发
desc: 关于Vuejs项目实战经验分享，一步一步带你学会用Vuejs框架开发项目。
reward: true
tags:
  - Vuejs
  - You-May-Not-Know-Vuejs
date: 2018-04-11 15:40:12
---

> by [yugasun](https://yugasun.com) from [https://yugasun.com/post/you-may-not-know-vuejs-10.html](https://yugasun.com/post/you-may-not-know-vuejs-10.html)
本文可全文转载，但需要保留原作者和出处。

## 初识插件

虽然 Vue.js 已经足够强大了，但是在实际开发中，我们还是需要引入各种模块来实现我们的功能需求，或者给全局的 Vue 对象添加一些全局功能，而 Vue `插件` 就是来帮助我们完成这项工作的。

<!--more-->

## 开发插件

Vuejs 插件范围没有限制，一般有以下几种：

  1. 添加全局方法或者属性，如：[vue-custom-element](https://github.com/karol-f/vue-custom-element)
  2. 添加全局资源：指令、过滤器、过度等，如： [vue-touch](https://github.com/vuejs/vue-touch)
  3. 通过全局 mixin 方法添加一些组件选项，如：[vue-router](https://github.com/vuejs/vue-router)
  4. 添加 Vue 实例方法，通过把它们添加到 `Vue.prototype` 上实现。
  5. 一个库，提供自己的 API，同时提供上面提到的一个或多个功能，如：[vue-router](https://github.com/vuejs/vue-router)

Vuejs 插件应当有一个公开方法 `install`，这个方法的第一个参数是 `Vue` 构造器，第二个参数是一个可选的配置对象，书写方式如下：

```js
MyPlugin.install = function(Vue, options) {
  // 1. 添加全局方法或属性
  Vue.myGlobalProp = 'yugasun';
  Vue.myGlobalMethod = function() {
    // 逻辑
  };

  // 2. 添加全局资源：
  Vue.directive('my-directive', {
    bind(el, binding, vnode, oldVnode) {
      // 逻辑
    }
  });

  // 3. 注入通用方法或属性给组件
  Vue.mixin({
    data(){
      return {
        // 通用数据,
      };
    },
    created() {
      // 逻辑
    },
  });

  // 4. 添加实例方法
  Vue.prototype.$myMethod = function(methodOptions) {
    // 逻辑
  };
};
```

## 使用插件

插件使用起来很简单，只需要引入，然后通过调用 `Vue.use()` 方法就行了：

```js
import Vue from 'vue';
import MyPlugin from './MyPlugin';
Vue.use(MyPlugin, {someOption: true});
```

## 开发组件

我们这里以 [vue-axios-plugin](https://github.com/yugasun/vue-axios-plugin) 为例，它是一个对 [axios](https://github.com/axios/axios) 二次封装的插件，便于在项目中直接通过 `this.$http.get/post` 来直接调用请求方法。

首先根据上面的模板，创建入口文件 `vue-axios-plugin.js`：

```js
const VueAxiosPlugin = {}
VueAxiosPlugin.install = (Vue, options) => {

}
export default VueAxiosPlugin
```

然后给 Vue 添加实例方法：

```js
import axios from 'axios'
const VueAxiosPlugin = {}
VueAxiosPlugin.install = (Vue, options) => {
  const service = axios.create(options)
  Vue.prototype.$axios = service
  Vue.prototype.$http = {
    get: (url, data, options) => {
      let axiosOpt = {
        ...options,
        ...{
          method: 'get',
          url: url,
          params: data
        }
      }
      return service(axiosOpt);
    },
    post: (url, data, options) => {
      let axiosOpt = {
        ...options,
        ...{
          method: 'post',
          url: url,
          data: data
        }
      }
      return service(axiosOpt);
    }
  }
}
export default VueAxiosPlugin
```

> 具体 axios 的使用方法，请阅读官方文档 [axios](https://github.com/axios/axios)

现在已经完成插件的基本开发了，在项目中测试下，：

```js
import VueAxiosPlugin from './vue-axios-plugin'
Vue.use(VueAxiosPlugin)
```

然后你就可以在你的组件中直接使用添加的全局方法了：

```js
 var app = new Vue({
  el: '#app',
  data: {
    content: 'Sending...'
  },
  methods: {
    getUserInfo() {
      Promise.all([
        this.$http.get('http://yapi.demo.qunar.com/mock/5802/user', { id: 1 }),
        this.$http.post('http://yapi.demo.qunar.com/mock/5802/user', {
          username: 'yugasun',
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
      ]).then((res) => {
        console.log(res)
      }).catch((e) => {
        console.log(e)
      })
    }
  },
  created() {
    this.getUserInfo()
  }
})
```

## 发布组件

插件已经写好了，你可以复制该文件在不同的项目中复用了。如果觉得每次都复制文件比较麻烦，你可以通过阅读上一篇 [定制开发项目模板](https://yugasun.com/post/you-may-not-know-vuejs-10.html) 文章，将该插件文件直接添加到项目模板中即可。当然如果你的插件足够好，也可以发布到 npm 社区，供全世界的程序员同胞使用。

每次项目紧急，有个需求很难搞定时，我们就会想着从 github  上搜索我们需要的项目，既然我们从社区获取了那么多，当然也要学会感恩，偶尔尝试着去回报下，不求代码有多么高的质量，哪怕是单纯地帮助修改一个说明文档中的错误，那也是一份贡献，也许你的这次修改可以帮助别人节省半天的时间，任何项目都是在不断迭代中成长的。

随时欢迎进入全球最大的同性交友网站 [~~Gay~~Github](https://github.com)，贡献你的第一份源代码~

[源码在此](https://github.com/yugasun/vue-axios-plugin)

## 专题目录

[You-May-Not-Know-Vuejs](https://github.com/yugasun/You-May-Not-Know-Vuejs#%E6%96%87%E7%AB%A0%E7%9B%B4%E9%80%9A%E8%BD%A6)
