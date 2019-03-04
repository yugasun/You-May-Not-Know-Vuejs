---
title: 你也许不知道的Vuejs - 状态管理
desc: 关于Vuejs项目实战经验分享，一步一步带你学会用Vuejs框架开发项目。
reward: true
tags:
  - Vuejs
  - You-May-Not-Know-Vuejs
date: 2018-05-21 15:46:22
---

> by [yugasun](https://yugasun.com) from [https://yugasun.com/post/you-may-not-know-vuejs-12.html](https://yugasun.com/post/you-may-not-know-vuejs-12.html)
本文可全文转载，但需要保留原作者和出处。

## 前言

> `小撸怡情，大撸伤身，强撸灰飞烟灭`，恩，大概是本人代码撸多了的缘故，我的女朋友就像 `复联3` 结局一样，灰飞烟灭了（分手了，当然原因不只是这么简单，人总得给自己的失败找个借口，不是吗......）。
> 所以从3月份开始，心情一直很差，文章也更新的越来越慢。恰巧今天是 `520`，从一大早起来开始，朋友圈就异常的热闹，有秀恩爱的，有秀悲伤地，还有少数微商依旧坚挺的发着广告。正是这些坚强的微商让我明白了，无论别人如何秀，坚定自己的目标继续做下去就是了，也就在这一天我彻底的从失恋中走了出来......

<!--more-->

好了，言归正传，今天来聊聊 Vue.js 中的状态管理，也许一提到状态管理，大家首先想到的就是 [vuex](https://github.com/vuejs/vuex/)，但是如果你的应用够简单，其实是不需要使用 vuex 的，反而会让你的项目变得繁琐起来。

本文总结了4种实现组件间状态的共享的方法：

> 1. 共享对象
> 2. mixins 混入
> 3. 全局的 Event Bus
> 4. Vuex

下面我将分别实现一遍。

## 共享对象

在日常工作中，我们会经常提到对象的拷贝，由于：

> Javascript 语言的对象在赋值的时候，只是将其引用地址赋值给了一个新的变量而已，所以在改变新对象属性是，会同时改变原对象属性。

所以大家在写代码的时候会尽量的避免此类事情的发生，但是也正是因为这个特性，我们可以实现 Vuejs 中的状态共享。

思路如下：

> 首先初始化一个全局对象，维护着全局数据，然后将其注入到所有用到的组件中，那么在组建内改变某个属性值，其他组件也就同步更新了。

明白了原理就很好实现了。同样的通过 `vue-cli` 初始化我们的项目模板，然后新建 `src/state.js` 文件：

```js
export default {
  msg: 'Hello world',
};
```

然后，分别创建需要引用的组件：

```html
<!-- comp1 -->
<template>
  <div class="comp1">
    <h1>Component 1</h1>
    <input type="text" v-model="state.msg">
  </div>
</template>
<script>
import state from '../state';

export default {
  name: 'comp1',
  data() {
    return {
      state,
    };
  },
};
</script>

<!-- comp2 -->
<template>
  <div class="comp2">
    <h1>Component 2</h1>
    <input type="text" v-model="state.msg">
  </div>
</template>
<script>
import state from '../state';

export default {
  name: 'comp2',
  data() {
    return {
      state,
    };
  },
};
</script>
```

然后在 `src/App.vue` 文件中使用 `comp1` 和 `comp2`:

```html
<template>
  <div class="app">
    <comp1></comp1>
    <comp2></comp2>
  </div>
</template>
<script>
import comp1 from './components/comp1';
import comp2 from './components/comp2';

export default {
  name: 'App',
  components: {
    comp1,
    comp2,
  },
};
</script>
```

ok，这样就完成了，运行项目，你会发现，改变 `comp1` 中的输入框的值，`comp2` 也同步发生改变，反过来也是一样的。至于原理，上面已经说过了，这里就不再赘述，赶紧动手实现下吧。

[最终实现代码](https://github.com/yugasun/You-May-Not-Know-Vuejs/blob/master/chapter3/vue-state/1)

## mixins - 混入

我们先来看看官方对 `mixins` 介绍：

> 混入 (mixins) 是一种分发 Vue 组件中可复用功能的非常灵活的方式。混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被混入该组件本身的选项。

所以我们也可以通过 `mixins` 的方式，将我的的全局状态 `state` 通过 `mixins` 的方式引入到各个组件中，当然数据其实还是通过 `对象引用` 实现的。

我们修改一下 `src/state.js`：

```js
const state = {
  msg: 'Hello world',
};

export default {
  data() {
    return {
      state,
    };
  },
};
```

然后 `comp1` 中引入：

```html
<template>
  <div class="comp1">
    <h1>Component 1</h1>
    <input type="text" v-model="state.msg">
  </div>
</template>
<script>
import state from '../state';

export default {
  mixins: [state],
  name: 'comp1',
  data() {
    return {};
  },
};
</script>
```

`comp2` 也是相同方法引入就行了。

其实，通过 `mixins` 方式跟 `方法1` 基本差不多，只不过相对于 `方法1` 的好处就是，在使用组件内，将状态数据属性跟 `data` 进行了代码上隔离（实际上还是混入到了 `data` 属性中）。

[最终实现代码](https://github.com/yugasun/You-May-Not-Know-Vuejs/blob/master/chapter3/vue-state/2)

## 全局的事件总线（Event Bus）

我们知道 Vuejs 有一对API `$on/$emit`，是用来自定义事件监听和触发的，而且在触发的时候可以携带数据。这样我们就可以通过创建一个全局的 Vue 实例 `$bus`，然后在各个组件中进行相关事件的触发和监听，数据流的传递和共享，这也就是大家常说的 `发布订阅模式`。

熟悉 `$on/$emit` API的同学，应该很容易就可以实现了，先上代码：

### 简洁版

`src/state.js`:

```js
import Vue from 'vue';

const EventBus = new Vue();

export default EventBus;
```

`src/components/comp1.vue`:

```html
<template>
  <div class="comp1">
    Change by event: <input type="text" v-model="msg" @change="handleChange">
  </div>
</template>
<script>
export default {
  name: 'comp1',
  data() {
    return {
      msg: this.$bus.msg,
    };
  },
  methods: {
    handleChange(e) {
      const newVal = e.target.value;
      this.$bus.$emit('msg-change', { value: newVal });
    },
  },
  created() {
    this.$bus.$on('msg-change', (payload) => {
      this.msg = payload.value;
    });
  },
};
</script>
```

`src/components/comp2` 代码同 `src/components/comp1`。

好了，先运行一下，同样达到了我们想要的效果。上面代码中，我们先在 `src/state.js` 中创建了一个 Vue 实例，然后在组件中 `created` 的时候监听 `msg-change` 事件，在 `input` 值改变的时候，触发 `msg-change` 事件，这样就实现了 `comp1` 和 `comp2` 的 `msg` 数据共享。

### 升级版

我们知道 `$bus` 实际上也是个对象，那么我们其实也可以通过给他添加 `data` 属性来进行数据共享的，现在将上面代码再稍作修改：

`src/state.js`:

```js
import Vue from 'vue';

const EventBus = new Vue({
  data: {
    msg: 'Hello world',
  },
});

export default EventBus;
```

然后分别在 `src/components/comp1` 和 `src/components/comp1` 中添加数据引用：

```html
<!-- ... -->
Change by object reference: <input type="text" v-model="$bus.msg"><br/>
<!-- ... -->
```

然后试着改变新添加的输入框数据，你会发现，新添加的两个输入框，数据也是同步更新的。

细心的同学，会发现有个问题，虽然新添加的两个输入框同步了，但是之前的两个事件触发的输入框并未同步更新。因为我们只是单纯地修改了对象属性，并未触发 `msg-change` 事件，所以还需要在 `$bus` 中添加 `watcher`，在 `msg` 变化时，触发 `msg-change` 事件；反过来，`$bus`自身需要监听 `msg-change` 事件，在触发的时候，修改自身 `msg` 的值就可以了。

我们再修改下 `src/state.js` 代码：

```js
import Vue from 'vue';

const EventBus = new Vue({
  data: {
    msg: 'Hello world',
  },
  watch: {
    // 这里为了实现对象引用监听，然后出发change事件，实现状态同步
    msg(val) {
      this.$emit('msg-change', { value: val });
    },
  },
});

EventBus.$on('msg-change', (payload) => {
  console.log(`Msg has changed to ${payload.value}`);
  EventBus.msg = payload.value;
});

export default EventBus;
```

当然我们这里只是为了demo，实际开发过程中，自己一定要清楚，这里其实有两个数据管道，一个是 `发布/订阅` 可以理解为单工（单向数据流）模式，一个是 `对象共享` 也就是 `方法2`，可以理解为双工（双向数据流）模式。首先你需要理解清楚 `当前需要共享的数据是单向还是双向`，然后根据场景灵活运用。

[最终实现代码](https://github.com/yugasun/You-May-Not-Know-Vuejs/blob/master/chapter3/vue-state/3)

## Vuex

至于 Vuex 的使用，本文就不再实现了，官方文档已经写得很清楚，请细心阅读 [官方文章](https://vuex.vuejs.org/zh-cn/intro.html)。

## 总结

本文写了这么多其实想告诉大家，对于 Vuejs 状态管理，我们不仅仅只有 `vuex`，框架或工具的选择不是固定的，实际开发中，可以多尝试，找到最适合的架构才是最好的。引用 Vue 的作者的话就是：

> 如果您不打算开发大型单页应用，使用 Vuex 可能是繁琐冗余的。确实是如此——如果您的应用够简单，您最好不要使用 Vuex。一个简单的 global event bus 就足够您所需了。但是，如果您需要构建一个中大型单页应用，您很可能会考虑如何更好地在组件外部管理状态，Vuex 将会成为自然而然的选择。

## 专题目录

[You-May-Not-Know-Vuejs](https://github.com/yugasun/You-May-Not-Know-Vuejs#%E6%96%87%E7%AB%A0%E7%9B%B4%E9%80%9A%E8%BD%A6)
