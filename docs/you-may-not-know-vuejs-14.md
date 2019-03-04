---
title: 你也许不知道的Vuejs - 最佳实践（2）
desc: 关于Vuejs项目实战经验分享，一步一步带你学会用Vuejs框架开发项目。
reward: true
tags:
  - Vuejs
  - You-May-Not-Know-Vuejs
date: 2019-02-28 14:17:20
---


> by [yugasun](https://yugasun.com) from [https://yugasun.com/post/you-may-not-know-vuejs-14.html](https://yugasun.com/post/you-may-not-know-vuejs-14.html)
本文可全文转载，但需要保留原作者和出处。

我们在实际开发过程中，当项目越来越大，组件越来越丰富时，经常会面临一个问题：很多组件会公用一些通用的 `props`、`data` 和 `methods`等声明，但是也会掺杂组件自己的一些私有特有声明，那么我们能不能像类的继承一样，来提炼和继承呢？ 当然这是可以的，这里可以通过两个基本 API [extends](https://cn.vuejs.org/v2/api/#extends) 和 [mixins](https://cn.vuejs.org/v2/api/#mixins) 来实现。这两个API是可以相互替换的，唯一的区别是，`extends` 属性接受的通常是个单一组件对象，而 `mixins` 属性接受的是个组件对象数组。当他们只继承单一组件时，是可以互换的。由于本人开发中，习惯使用 `mixins`，所以本文所有实例均使用 `mixins` 来实现。

<!--more-->

## mixins

先来看看官方介绍：

> `mixins` 选项接受一个混入对象的数组。这些混入实例对象可以像正常的实例对象一样包含选项，他们将在 Vue.extend() 里最终选择使用相同的选项合并逻辑合并。举例：如果你的混入包含一个钩子而创建组件本身也有一个，两个函数将被调用。

简单的理解就是Vue实例中的所有属性配置可以通过 `mixins` 实现继承。

简单示例如下：

```js
var mixin = {
  created: function () { console.log(1) }
}
var vm = new Vue({
  created: function () { console.log(2) },
  mixins: [mixin]
})
// => 1
// => 2
```

### 案例1

假设有这么个需求： `在某个组件渲染后向服务器端发送一个请求，进行打点`，好的，很快我们想到 `mounted` 钩子函数，然后快速的实现了需求，代码如下：

```js
export default {
  name: 'comp1',
  // ...
  mounted() {
    console.log('Component comp1 mounted');
  }
  // ...
}
```

然后某一天需求变成了 `某几个 组件需要进行打点`，好的，我们又进行了一顿猛如虎的操作，将上面代码复制到每个打点的组件，很快把需求搞定了。可是噩梦才刚刚开始，过了几天需求又变了，除了在组件渲染后需要打点，同时还需要在 `created` 后打点..... `此种场景是不是像极了爱情`，面对现实我们总是在不停屈服，最终还是忍痛把需求做了。

回头冷静思考下，其实这个打点是很普遍的需求。如果从头来过，我们一定会选择用继承的方式来实现，而不是盲目的去爱，哦不，盲目的复制粘贴。因为我们有 `mixins`，只需要编写一次，到处可用。那就让我们从头再来一次，首先创建一个 `src/minins/log.js` 文件:

```js
export default {
  created() {
    console.log(`Component ${this.$options.name} created.`);
  },
  mounted() {
    console.log(`Component ${this.$options.name} mounted.`);
  },
};
```

然后在你需要的任何一个组件中引入使用：

```js
import logMixin from '@/mixins/log';

export default {
  name: 'comp1',
  mixins: [logMixin],
  // ...
}
```

一番修改后，你会发现产品经理妹子也可以那么迷人，是不是你又开始相信爱情了......

运行项目，打开控制台输出如下：

```js
Component comp1 created.
Component comp2 created.
```

### 案例2

上面的需求是组件打点，现在我们新增了需求，需要给某几个组件添加一个通用方法 `sayHello` 到 `methods` 中，并在组件渲染后调用，但是只是上面打点的部分组件需要添加此功能，虽然只是部分组件，但也有个上百个吧（`夸张手法，切勿模仿`）。听到这里，你默默推开了身边的产品妹子，拒绝道：`对不起，我已经不相信爱情了`。此时，有个声音在轻声的嘀咕着：`你还可以相信的！`。

好的，那么，我就再让你相信一次。首先添加文件 `src/mixins/func.js`:

```js
export default {
  mounted() {
    this.sayHello();
  },
  methods: {
    sayHello() {
      console.log('产品妹子，你好美！');
    },
  },
};
```
然后在需要的组件中引入就行了：

```js
import logMixin from '@/mixins/log';
import funcMixin from '@/mixins/func';

export default {
  name: 'comp1',
  mixins: [logMixin, funcMixin],
  // ...
}
```

运行项目，打开控制台输出如下：

```js
Component comp1 created.
Component comp2 created.
Component comp1 mounted.
产品妹子，你好美！
Component comp2 mounted.
```

### 案例3

好了，你终于可以跟产品妹子一起在夕阳下愉快地奔跑了。突然有一天，`组件渲染后打点，成了公司的规范`，也就是你编写的所有组件都需要打点了，产品妹子很无奈的看着你说：`这不是我想要的结果，是你做的太优秀，被公司提上了日程，写入了编码规范`.....可现实就是这样，`你总想逃，却逃不掉`......

其实你还可以逃的，[Vue.mixin](https://cn.vuejs.org/v2/api/#Vue-mixin) 说。

> 全局注册一个混入，影响注册之后所有创建的每个 Vue 实例。插件作者可以使用混入，向组件注入自定义的行为。**不推荐在应用代码中使用**。

这不就是你一直追寻的爱情吗？于是你移除了之前引入的 `logMixin`，然后默默地在入口文件(`src/main.js`)中写下了爱情的宣言：

```js
//...
Vue.mixin({
  created() {
    console.log(`Component ${this.$options.name} created from 全局打点`);
  },
  mounted() {
    console.log(`Component ${this.$options.name} mounted from 全局打点`);
  },
});

// new Vue....
```

运行项目，打开控制台输出如下：

```js
Component undefined created from 全局打点
Component App created from 全局打点
Component Index created from 全局打点
Component router-link created from 全局打点
Component comp1 created from 全局打点
Component comp1 created.
Component comp2 created from 全局打点
Component comp2 created.
Component comp3 created from 全局打点
Component router-link mounted from 全局打点
Component comp1 mounted from 全局打点
Component comp1 mounted.
产品妹子，你好美！
Component comp2 mounted from 全局打点
Component comp2 mounted.
Component comp3 mounted from 全局打点
Component Index mounted from 全局打点
Component App mounted from 全局打点
Component undefined mounted from 全局打点
```

> 你会发现所有的 Vue 组件都注入了打点。

## 原理解析

其实 `mixins` 用起来非常简单，但是其背后的原理，还是值得我们去深究的:

1. 为什么 `mixins` 后，钩子函数是依次执行的，而不是替换？
2. 为什么 `mixins` 后，自身 `data` 属性优于混入属性？

要想回答上面的问题，我们得从 vue 源码开始说起。

Vue 在初始化 `mixin` 的时候，对于不同的属性，采用的策略是不同的，初始化代码在文件 [src/core/global-api.js](https://github.com/vuejs/vue/blob/dev/src/core/global-api/mixin.js) 中， 如下：

```js
import { mergeOptions } from '../util/index'

export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    Vue.options = mergeOptions(Vue.options, mixin)
  }
}
```

你会发现是通过 `mergeOptions` 函数来进行合并的，它在文件 [src/core/util/options.js](https://github.com/vuejs/vue/blob/dev/src/core/util/options.js#L388), 它的源码如下：

```js
/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
export function mergeOptions (
  parent: Object,
  child: Object,
  vm?: Component
): Object {
  // 省略不必要代码
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }
  function mergeField (key) {
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}
```

这个函数很好理解，大概做的事情就是将 `child` 的属性合入到 `parent` 中，不同属性采用了不同的策略，这些策略都定义在 `strats` 对象上。

我们先看看 `生命周期函数` 的合并策略，代码如下：

```js
/**
 * Hooks and param attributes are merged as arrays.
 */
function mergeHook (
  parentVal: ?Array<Function>,
  childVal: ?Function | ?Array<Function>
): ?Array<Function> {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}
```

可以发现 Vue 实例的生命周期函数最终都赋值成了一个数组，并对 `mixins` 中的进行了数组合并。这就是为什么组件 `mixins` 后的生命周期函数是依次执行的原因。

同样再来看看 `data` 的合入策略：

```js
/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to: Object, from: ?Object): Object {
  let key, toVal, fromVal
  for (key in from) {
    toVal = to[key]
    fromVal = from[key]
    if (!hasOwn(to, key)) {
      set(to, key, fromVal)
    } else if (isObject(toVal) && isObject(fromVal)) {
      mergeData(toVal, fromVal)
    }
  }
  return to
}
```

这个过程就是对象属性的合并，但是 `to` 上的优先级是高于 `from` 的，这就是为什么我们在对一个组件进行 `mixins` 的时候，自身 `data` 优先级高于混入的 `data` 属性，也就是如果 `mixins` 中和自身均含有相同属性时，混入属性值不会被添加到当前组件中。

感兴趣的同学，还可以去研究下其他属性的混入策略，源码均在 [src/core/util/options.js](https://github.com/vuejs/vue/blob/dev/src/core/util/options.js#L388) 中，也很好理解。

## 总结

越是简单的东西，越是把双刃剑，实际使用中一定要注意，特别是全局性的混入，这会带来性能开销。大家可以多编写，多总结，找到最合适的使用习惯就好，建议多阅读著名开源项目的源码，你会从中学到更多前辈们的技巧。

[源码在此](https://github.com/yugasun/You-May-Not-Know-Vuejs/blob/master/chapter4/2)

## 专题目录

[You-May-Not-Know-Vuejs](https://github.com/yugasun/You-May-Not-Know-Vuejs#%E6%96%87%E7%AB%A0%E7%9B%B4%E9%80%9A%E8%BD%A6)
