---
title: 你也许不知道的Vuejs - 强大的指令系统
desc: 关于Vuejs项目实战经验分享，一步一步带你学会用Vuejs框架开发项目。
reward: true
date: 2018-02-05 21:09:08
tags:
  - Vuejs
  - You-May-Not-Know-Vuejs
---

> by [yugasun](https://yugasun.com) from [https://yugasun.com/post/you-may-not-know-vuejs-3.html](https://yugasun.com/post/you-may-not-know-vuejs-3.html)
本文可全文转载，但需要保留原作者和出处。

> 在 `Vuejs` 中，指令（Directives）是带有 `v-` 前缀的特殊属性。指令属性的预期值是 **单个 Javascript 表达式**（`v-for` 是个例外）。指令的职责是，当表达式改变时，将其产生的连带影响，响应式的作用于 DOM。

当然，Vue 除了核心功能默认内置的指令外，更强大的是它允许注册自定义指令，这是个让我非常惊喜功能。因为当初在使用 `Angular1.x` 时就特别喜好自定义指令这个功能，没想到 Vue 也借鉴了进来，让我能够灵活对 DOM 进行底层操作，而且它具有非常高的复用性，书写起来也非常简洁。

当然在 Vue 中，代码的复用和抽象的主要形式还是 `组件`，这将在下一节中讲到。

<!--more-->

## 内置指令

Vue 提供供了大概 13 种内置指令，基本上能够满足我们的日常开发需求，不得不说作者考虑的已经非常全面，给尤大大点赞。这里只介绍 [v-for](https://cn.vuejs.org/v2/api/#v-for)、[v-on](https://cn.vuejs.org/v2/api/#v-on) 两种内置指令，感兴趣的可以到 [官方API](https://cn.vuejs.org/v2/api/#%E6%8C%87%E4%BB%A4) 了解。

1.[v-for](https://cn.vuejs.org/v2/api/#v-for)

上一节我们已经使用过了，它是基于源数据多次渲染元素或莫板块的。此指令的值，必须使用特定语法 `alias in expression` 来进行输出。 `expression` 为需要遍历的对象，它可以是 `Array | Object | number | string` 四种类型，`alias` 为遍历的元素别名。这个跟 js 的遍历函数 `map` 很相似，先来看个例子：

```html
<div id="app1">
  <ul>
    <li v-for="item in 5">
      {{ item }}
    </li>
  </ul>
</div>
```

```js
var app1 = new Vue({
  el: "#app1",
})
```

这里是在页面上依次输出 1~5 的数字，此时 `expression` 为 `5`，`number`（number 必须为正整数） 类型。 Vue 在渲染时，会先创建一个长度为 `5` 的数组，然后遍历输出 `item + 1` 的值。如果为 `string` 类型，就会创建一个该字符串长度的数组，再遍历输出字符串的每个字符。单纯讲肯定不太好理解，其实这部分源码很简单，大家可以直接通过阅读来理解：[官方源码](https://github.com/vuejs/vue/blob/dev/src/core/instance/render-helpers/render-list.js#L17-L34)。

大多数时候，`expression` 都只是个数组，其实知道它还可以为 `string` 或者 `number` 是很有用的，比如我们需要快速重复输出一个DOM，使用 `number` 能很快实现，节约了我们复制粘贴或者书写数组列表的时间。当为 `string` 时，我们可以根据需求依次输出每个字符，以此可以做出很炫酷的打字效果，如下：

```html
<div id="app2">
  <span v-for="(item, index) in name" v-bind:style="{animationDelay: `${0.5 + index * 0.3}s`}">{{ item }}</span>
</div>
```

```css
#app2 span {
  animation: flip-in 1s 0s ease-in-out both;
}
@keyframes flip-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

```js
// demo 2
var app2 = new Vue({
  el: "#app2",
  data () {
    return {
      name: 'yugasun'
    }
  }
})
```

怎么样？曾今看到别人做出炫酷的打字效果简历是不是很羡慕，这里只需要20行代码就可以实现打字效果，赶紧动手试试吧~

> 注意： 这里在设置每个字符的 `animation-delay` 属性时，用到了 `v-bind` 指令，这个很简单，这里不做赘述。同时使用了 ES6 的模板字符语法来计算时延的值，如果浏览器不支持，建议更换为新版 Chrome 浏览器。[模板字符串](http://es6.ruanyifeng.com/#docs/string#%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2) 教程在这里。

2.[v-on](https://cn.vuejs.org/v2/api/#v-on)

`v-on` 指令是用来绑定事件监听器的，事件类型可以是DOM原生事件，也可以是通过 [$emit](https://cn.vuejs.org/v2/api/#vm-emit) 触发的自定义事件。但是只有用在自定义元素组件上时，才可以监听组件触发的自定义事件。

> 在监听原生 DOM 事件时，方法以事件为唯一的参数。如果使用内联语句，语句可以访问一个 `$event` 属性：`v-on:click="handle('ok', $event)"`

看代码更好理解：

```html
<div id="app3">
  <button v-on:click="handleClick('确定', $event)">确定</button>
  <button v-on:click="handleClick('取消', $event)">取消</button><br>
  {{ msg }}
</div>
```

```js
var app3 = new Vue({
  el: "#app3",
  data () {
    return {
      btnText: ''
    }
  },
  computed: {
    msg () {
      return this.btnText ? `点击了 ${this.btnText} 按钮` : '您还没点击任何按钮'
    }
  },
  methods: {
    handleClick (text, e) {
      console.log(e)
      this.btnText = text
    }
  }
})
```

这里通过 `v-on` 监听了两个按钮的点击事件，并分别传递了各自的文字到监听函数进行输出，输出的 `msg` 是计算属性（如果不懂什么是计算属性，教程在这里 [深入浅出响应式系统](https://yugasun.com/post/you-may-not-know-vuejs-2.html)），依赖 `btnText` 动态计算的。可以通过控制台查看打印出的参数 `e` 对象就是一个原生 `MouseEvent` 对象。

除了基本的用法， `v-on` 指令还提供了丰富的 `修饰符` 来配合使用，这样可以写出非常灵活的监听事件，比如我们经常使用的 `e.preventDefault()`，在 Vue 中我们只需要通过  `v-on:click.prevent` 就可以实现了，是不是很炫酷，所有的修饰符列表在 [这里](https://cn.vuejs.org/v2/api/#v-on)。这里我们来演示下，点击鼠标左键和右键的事件监听，将上面的 html 代码修改如下：

```html
<div id="app3">
  <!-- 相对于上面只添加了 `.left` 和 `.right` 修饰符 -->
  <button v-on:click.left="handleClick('确定', $event)">确定</button>
  <button v-on:click.right="handleClick('取消', $event)">取消</button><br>
  {{ msg }}
</div>
```

## 自定义指令

最让我激动人心的就是自定义指令了，它即可以通过 [Vue.directive](https://cn.vuejs.org/v2/api/#Vue-directive) 注册全局指令，也可以给 Vue 实例添加 `directives` 属性来注册局部指令。这两种指令都是通过指令定义时的钩子函数实现的。

关于钩子函数和钩子函数参数介绍请直接阅读官方文档，官方文档已经讲述的非常详细了，这里不再赘述，直通车：[钩子函数](https://cn.vuejs.org/v2/guide/custom-directive.html#%E9%92%A9%E5%AD%90%E5%87%BD%E6%95%B0)、[钩子函数参数](https://cn.vuejs.org/v2/guide/custom-directive.html#%E9%92%A9%E5%AD%90%E5%87%BD%E6%95%B0%E5%8F%82%E6%95%B0)

相信你们已经很快看完了官方文档介绍了，好了现在我将带你来领略自定义指令的强大，实现一个倒计时指令。

钩子函数 `bind` 是在元素第一次绑定到元素时调用的，所以我们可以在这里初始化绑定的元素 `el`，而且绑定元素已经作为所有钩子函数的第一个参数被传入，这里可以通过 `el.innerHTML` 就很容易修改绑定元素的内容了，代码如下：

```html
<div id="app4">
  <button v-on:click="startCount">开始倒计时</button>
  <span data-count="60" v-count-down="count" v-if="show" style="font-size:16px;"></span>
</div>
```

```js
var app4 = new Vue({
  el: '#app4',
  data () {
    return {
      show: false, // 是否显示倒计时
      timer: null // 定时器
    }
  },
  methods: {
    startCount: function () {
      this.show = true
    }
  },
  directives: {
    'count-down': {
      bind: function (el, binding, vnode) {
        el.innerHTML = '60'
      }
    }
  }
})
```

当我们点击按钮是，将 `show` 置为 `true`，此时 `v-if` 指令就判断显示使用 `v-count-down` 指令的元素，然后执行 `bind` 初始化函数，将元素内容修改为 `60`。这里很好理解。但是我们要实现倒计时，就需要创建一个定时器，并需要维护一个数实现递减，这里通过动态修改 `data-count` 的值来实现。

> **实现思路**：当初始化时，创建一个定时器，每隔1s将获取 `data-count` 的值减一，然后赋给 `el.innerHTML`，同时修改 `data-count` 属性为新的值，当然还需要添加判断，就是当然 `data-count` 为0时，清除计时器。

有了思路，实现代码就非常简单了：

```html
<div id="app4">
  <button v-on:click="startCount">开始倒计时</button>
  <span v-count-down data-count="60" v-if="show" style="font-size:16px;">
    60
  </span>
</div>
```

```js
var app4 = new Vue({
  el: '#app4',
  data () {
    return {
      show: false, // 是否显示倒计时
    }
  },
  methods: {
    startCount: function () {
      this.show = true
    }
  },
  directives: {
    'count-down': {
      bind: function (el, binding, vnode) {
        let count = parseInt(el.getAttribute('data-count'))
        if (this.timer) {
          clearInterval(this.timer)
          this.timer = null
        }
        // 大家可以推测下这里的 this 指什么？
        this.timer = setInterval(function () {
          if (count <= 0) {
            clearInterval(this.timer)
            this.timer = null
          } else {
            count--
            el.innerHTML = count
            el.setAttribute('data-count', count)
          }
        }, 1000)
      }
    }
  }
})
```

指令系统就介绍到这里，最后留给大家一个问题：

> 上面代码中有个 `this.timer`， 那么这个 `this` 指的是什么呢？如果我们需要将这个 `timer` 和 `count` 变量 维护在当前 Vue 实例中，该如何做呢？


[源码在此](https://github.com/yugasun/You-May-Not-Know-Vuejs/blob/master/chapter1/3.html)

## 专题目录

[You-May-Not-Know-Vuejs](https://github.com/yugasun/You-May-Not-Know-Vuejs#%E6%96%87%E7%AB%A0%E7%9B%B4%E9%80%9A%E8%BD%A6)
