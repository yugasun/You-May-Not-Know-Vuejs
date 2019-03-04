---
title: 你也许不知道的Vuejs - 深入浅出响应式系统
desc: 关于Vuejs项目实战经验分享，一步一步带你学会用Vuejs框架开发项目。
reward: true
date: 2018-02-02 21:09:08
tags:
  - Vuejs
  - You-May-Not-Know-Vuejs
---

> by [yugasun](https://yugasun.com) from [https://yugasun.com/post/you-may-not-know-vuejs-2.html](https://yugasun.com/post/you-may-not-know-vuejs-2.html)
本文可全文转载，但需要保留原作者和出处。

虽然说是Vuejs实践，但是有些重要的理论还是必不可少的，本文将简单的带你了解 `Vuejs的响应式原理`。

> Vue 最独特的特性之一，是其非侵入性的响应式系统。数据模型仅仅是普通的 Javascript 对象。而当你修改它们时，视图会进行更新。这使得状态管理非常简单直接，不过理解其工作原理同样非常重要，这样你可以回避一些常见的问题。

<!--more-->

## 原理图剖析

![vue-reactive-data](https://static.yugasun.com/vue-reactive-data.png)

仔细阅读这张官方原理图，大概可以剖析为以下几个步骤：

* 编译组件：对特殊标记的部分（比如双大括号部分）进行替换为相应的数据值。
* 收集依赖：对于编译阶段依赖的数据进行监听（这个都是通过 `watcher` 对象实现的）
* 通知更新：当步骤2中监听的数据发生变化时，会通知 `watcher` 进行重新计算，触发关联视图更新。

可以简单理解为一个发布订阅系统，当然这里的过程介绍比较通俗，单纯是为了理解而解释的，实际流程其实还是很复杂的。如果想结合源码深入了解的，建议去阅读这篇文章：
[Vue 源码解析：深入响应式原理](https://github.com/DDFE/DDFE-blog/issues/7)

## 关于Vuejs模板

上一篇中提到，Vue实例在初始化的时候会将目标节点 `div#app` 内容进行替换，是在定义了 `template` 属性或者 `render` 函数的前提下。否则会对把 `div#app` 内容当做模板进行编译输出。一般情况下，很少使用 `template` 属性来定义模板，因为实际开发过程中，我们的模板还是很复杂的，单纯通过 `template` 属性定义，我们的代码会显得非常臃肿，不便于阅读。所以，我们通常使用的是将模板内容写在过载目标元素的内部，稍后将采用这种方法做代码演示。

> 当然对于复杂项目，更多的是使用 [单文件组件](https://cn.vuejs.org/v2/guide/single-file-components.html) （这将在以后专题文章中介绍）。

## 百闻不如一见

还记得上一篇中讲述的如何实现一个简单的 Vue 应用，并通过不同的 API 实现了目标元素的渲染吧。不记得也不要紧，这里还是从最基本的代码开始。下面我们会动态的实现一个列表的渲染，并通过修改数据，来触发视图的更新，以此来感受下响应式系统的快感。先来看一段代码：

Demo1：[data](https://cn.vuejs.org/v2/api/#data)

```html
<div id="app">
  <button v-on:click="addItem">添加</button>
  <ul>
    <li v-for="(item, index) in list" v-bind:key="index">
      <a v-bind:href="item.url">{{ item.name }}</a>
    </li>
  </ul>
</div>
```

```js
var app = new Vue({
  el: "#app",
  data () {
    return {
      count: 1,
      list: [
        {
          name: 'Vuejs官网',
          url: 'https://cn.vuejs.org'
        },
        {
          name: 'Github',
          url: 'https://github.com'
        },
        {
          name: 'Yuga博客1',
          url: 'https://yugasun.com'
        }
      ]
    }
  },
  methods: {
    addItem () {
      this.count++
      this.list.push({
        name: 'Yuga博客' + this.count,
        url: 'https://yugasun.com'
      })
    }
  }
})
```

上面 Vue 实例在初始化的时候，属性 `data` 中定义了一个站点列表，然后模板中通过 `v-for` 指令进行列表渲染，同时也使用了 [v-bind](https://cn.vuejs.org/v2/api/#v-bind) 指令来进行属性绑定，并且通过 `v-on` 指令来监听按钮的 `click` 事件来执行 `addItem` 方法。当点击添加按钮，就会向 `list` push一条数据，视图会再次更新。（关于指令相关文章将在下一篇中讲到，感兴趣的同学可以先到官网学习了解。）


Demo2：[computed](https://cn.vuejs.org/v2/api/#computed)

在实际开发过程中，我们的接口请求到的数据往往会差强人意，这时就需要我们进行一些转化，来生成我们想要的数据结构，当然最直接的方式就是每次请求完数据就通过固定函数处理一遍，但是这个得手动执行。此时 `computed` 计算属性就可以用上了。

我们知道除了 `data` 中定义的数据可以再模板中使用外，`computed` 属性也可以。只不过 `computed` 中的属性是需要先进行计算，然后再返回想要的数据的。当我们输出某个属性，必须依赖另外一个 `data` 中的属性来动态计算获得的，此时使用 `computed` 就非常简单了。代码如下：

```js
var app = new Vue({
  el: "#app",
  data () {
    return {
      count: 1,
      // 实际开发中往往是通过接口请求获取
      requestList: [
        'Vuejs官网-https://cn.vuejs.org',
        'Github-https://github.com',
        'Yuga博客1-https://yugasun.com'
      ]
    }
  },
  computed: {
    list: function() {
      var list = [];
      this.requestList.map(function(item, index) {
        var tempArr = item.split('-');
        list.push({
          name: tempArr[0],
          url: tempArr[1]
        });
      })
      return list;
    }
  },
  methods: {
    addItem () {
      this.count++
      this.requestList.push('Yuga博客' + this.count + '-https://yugasun.com')
    }
  }
})
```

## 关于计算属性 - computed

关于计算属性，其实有个细节是很多同学没有注意到的，计算属性实际上是可以修改的！那么如何才能修改呢？

其实计算属性不仅可以定义为一个函数，也可以定义为一个含有 `get/set` 属性的对象。当我们定义为一个函数是，Vue 内部会默认将这个函数赋值给 `get` 属性，一般 `set` 是未定义的。当我们定义 `set` 属性后，就可以对它进行修改了。来看下面一段代码：

```html
<div id="app">
  <button v-on:click="changeName">改变姓名</button>
  <h2>{{ username }}</h2>
</div>
```

```js
var app = new Vue({
  el: "#app",
  data () {
    return {
      firstName: 'Yuga',
      lastName: 'Sun'
    }
  },
  computed: {
    username: {
      get: function() {
        return this.firstName + ' ' +  this.lastName;
      },
      set: function(newVal) {
        var names = newVal.split(' ');
        this.firstName = names[0];
        this.lastName = names[1];
      }
    }
  },
  methods: {
    changeName () {
      if (this.username === 'Yuga Sun') {
        this.username = 'Summer Wu';
      } else {
        this.username = 'Yuga Sun';
      }
    }
  }
})
```

当进行赋值操作 `this.username = 'Summer Wu'` 时，计算属性 `username` 的 `set` 函数就会被调用，同时也对 `firstName` 和 `lastName` 进行了相应的更新。这里看似是直接进行赋值操作，其实也是通过间接修改 `firstName` 和 `lastName` 来实现 `username` 的更新的。因为 `计算属性是基于它依赖的值进行缓存的`，如果它依赖的值没有发生改变，它自己就没法发生改变。

## 关于侦听器 - watch

创建 Vue 应用时，我们还提到过 `watch` 这个属性，它其实是个对象，键是需要观察的表达式，值是对应的回调函数。值也可以是方法名，或者包含选项的对象。和上面的计算属性类似，他可以监听 `值/表达式` 的变化来执行回调函数。我们先实现上面的功能：

```js
var app = new Vue({
  el: "#app",
  data () {
    return {
      firstName: 'Yuga',
      lastName: 'Sun',
      username: 'Yuga Sun'
    }
  },
  watch: {
    firstName: function(val, oldVal) {
      this.username = val + ' ' + this.lastName;
    },
    lastName: function (val, oldVal) {
      this.username = this.firstName + ' ' + val;
    }
  },
  methods: {
    changeName () {
      if (this.username === 'Yuga Sun') {
        this.firstName = 'Summer';
        this.lastName = 'Wu';
      } else {
        this.firstName = 'Yuga';
        this.lastName = 'Sun';
      }
    }
  }
})
```

以上就是最基础用法，往往有些时候我们的监听属性并没有那么简单。往往是一个对象，这时当我们修改该对象的属性时，如何实现监听呢？先看下面代码：

```html
<div id="app">
  <button v-on:click="changeName">改变姓名</button>
  <h4>{{ username }}</h4>
</div>
```

```js
var app = new Vue({
  el: "#app",
  data () {
    return {
      userinfo: {
        firstName: 'Yuga',
        lastName: 'Sun',
      },
      username: 'Yuga Sun'
    }
  },
  watch: {
    userinfo: function (val, oldVal) {
      this.username = val.firstName + ' ' + val.lastName;
    }
  },
  methods: {
    changeName () {
      if (this.username === 'Yuga Sun') {
        this.userinfo.firstName = 'Summer'
        this.userinfo.lastName = 'Wu'
      } else {
        this.userinfo.firstName = 'Yuga'
        this.userinfo.lastName = 'Sun'
      }
    }
  }
})
```

此时无论我们如何点击按钮，都无法改变 `username` 的值，因为 `watch` 侦听器默认只是侦听该对象本身的赋值操作，也就是直接对 `this.userinfo` 进行赋值操作时的变化，并未对其内部属性进行侦听。实际上对于侦听的值是可以为一个对象的，它还有个 `deep` 属性，用来设置是否侦听内部属性的变化，而回调函数是通过 `handler` 来设置的。我们再次修改代码如下：

```js
var app = new Vue({
  el: "#app",
  data () {
    return {
      userinfo: {
        firstName: 'Yuga',
        lastName: 'Sun',
      },
      username: 'Yuga Sun'
    }
  },
  watch: {
    userinfo: {
      deep: true,
      handler: function (val, oldVal) {
        this.username = val.firstName + ' ' + val.lastName;
      }
    }
  },
  methods: {
    changeName () {
      if (this.username === 'Yuga Sun') {
        this.userinfo.firstName = 'Summer'
        this.userinfo.lastName = 'Wu'
      } else {
        this.userinfo.firstName = 'Yuga'
        this.userinfo.lastName = 'Sun'
      }
    }
  }
})
```

点击按钮，你会发现 `username` 可以根据按钮点击更新了，这个属性在实际项目中非常实用，因为往往我们修改数据时，并不是整体赋值，大部分时候都是局部修改属性的，所以这个时候就需要通过设置 `deep` 属性为 `true`，来达到我们的侦听目的。

问题来了，当侦听对象包含很多属性，而我们只是需要监听其中的一个或某几个属性，这时如果我们通过这种方式侦听所有内部属性的变化，自然就会造成内存的浪费。那么能不能只侦听单一内部属性的变化呢？答案是肯定的。

其实在 `watch` 定义的时候，`键是可以为需要观察的表达式` 的，`表达式` 就是说明，我们是可以写成对象属性访问表达式的。比如我们只需要侦听姓氏的修改，我们可以写成 `userinfo.lastName`。再来看下面代码：

```js
var app = new Vue({
  el: "#app",
  data () {
    return {
      userinfo: {
        firstName: 'Yuga',
        lastName: 'Sun',
      },
      username: 'Yuga Sun'
    }
  },
  watch: {
    'userinfo.lastName': function (val, oldVal) {
      this.username = this.userinfo.firstName + ' ' + val;
    }
  },
  methods: {
    changeName () {
      if (this.username === 'Yuga Sun') {
        this.userinfo.lastName = 'Wu'
      } else {
        this.userinfo.lastName = 'Sun'
      }
    }
  }
})
```

这样我们就可以根据项目实际情况，灵活的使用侦听器来侦听我们所关注的属性了，赶紧动手试一试吧~

[源码在此](https://github.com/yugasun/You-May-Not-Know-Vuejs/blob/master/chapter1/2.html)

## 专题目录

[You-May-Not-Know-Vuejs](https://github.com/yugasun/You-May-Not-Know-Vuejs#%E6%96%87%E7%AB%A0%E7%9B%B4%E9%80%9A%E8%BD%A6)
