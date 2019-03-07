# 最佳实践(1)

有了前面文章的铺垫，相信一路看过来的新手的你开发一个中型的 Vuejs 应用已经不在话下，包括 Vuejs 生态核心工具（vue-router，vuex）的使用也不成问题。但是在实际项目开发过程中，我们要做的工作不仅仅是完成我们的业务代码，当一个需求完成后，我们还需要考虑更多后期优化工作，本篇主要讲述代码层面的优化。

<!-- more -->

## 被忽视的 setter 之计算属性

我们先回到上一篇的状态管理案例，使用 `vuex` 方式共享我们的 `msg` 属性，先创建 `src/store/index.js`：

```js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const types = {
  UPDATE_MSG: 'UPDATE_MSG',
};

const mutations = {
  [types.UPDATE_MSG](state, payload) {
    state.msg = payload.msg;
  },
};

const actions = {
  [types.UPDATE_MSG]({ commit }, payload) {
    commit(types.UPDATE_MSG, payload);
  },
};

export default new Vuex.Store({
  state: {
    msg: 'Hello world',
  },
  mutations,
  actions,
});
```

然后在组件 `comp1` 中使用它：

```html
<template>
  <div class="comp1">
    <h1>Component 1</h1>
    <input type="text" v-model="msg">
  </div>
</template>
<script>
export default {
  name: 'comp1',
  data() {
    const msg = this.$store.state.msg;
    return {
      msg,
    };
  },
  watch: {
    msg(val) {
      this.$store.dispatch('UPDATE_MSG', { msg: val });
    },
  },
};
</script>
```

同样对 `comp2` 做相同修改。当然还得在 `src/main.js` 中引入：

```js
import Vue from 'vue';
import App from './App';
import store from './store';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  store,
  el: '#app',
  template: '<App/>',
  components: { App },
});
```

> 如果还不知道 vuex 基本使用，建议先阅读官方文档。

好了，我们已经实现 `msg` 的共享了，并且对其变化进行了 `watch`，在输入框发生改变时，通过 `$store.dispatch` 来触发相应 `UPDATE_MSG` actions 操作，实现状态修改。但是你会发现修改 `comp1` 中的输入框，通过 `vue-devtools` 也可查看到 Vuex 中的的 `state.msg` 的确也跟着变了，但是 `comp2` 中输入框并没有发生改变，当然这因为我们初始化 `msg` 时，是直接变量赋值，并未监听 `$store.state.msg` 的变化，所以两个组件没法实现同步。

有人又会说了，再添加个 `watch` 属性，监听 `$store.state.msg` 改变，重新赋值组件中的 `msg` 不就行了，确实可以实现，但是这样代码是不是不太优雅，为了一个简单的 `msg` 同步，我们需要给 `data` 添加属性，外加两个监听器，是不是太不划算？

其实这里是可以通过计算属性很好地解决的，因为组件中的 `msg` 就是依赖 `$store.state.msg` 的，我们直接定义计算属性 `msg`，然后返回不就可以了。

ok，修改 `comp1` 如下：

```html
<template>
  <div class="comp1">
    <h1>Component 1</h1>
    <input type="text" v-model="msg">
  </div>
</template>
<script>
export default {
  name: 'comp1',
  computed: {
    msg() {
      return this.$store.state.msg;
    },
  },
};
</script>
```

我们再次修改 `comp1` 中的输入框，打开控制台，会报如下错误：

```bash
vue.esm.js?efeb:591 [Vue warn]: Computed property "msg" was assigned to but it has no setter.
...
```

因为我们使用的是 `v-model` 来绑定 `msg` 到 input 上的，当输入框改变，必然触发 `msg` 的 `setter（赋值）`操作，但是计算属性默认会帮我定义好 `getter`，并未定义 `setter`，这就是为什么会出现上面错误提示的原因，那么我们再自定义下 `setter` 吧：

```html
<template>
  <div class="comp1">
    <h1>Component 1</h1>
    <input type="text" v-model="msg">
  </div>
</template>
<script>
export default {
  name: 'comp1',
  computed: {
    msg: {
      get() {
        return this.$store.state.msg;
      },
      set(val) {
        this.$store.dispatch('UPDATE_MSG', { msg: val });
      },
    },
  },
};
</script>
```

可以看到，我们正好可以在 `setter` 中，也就是修改 `msg` 值得时候，将其新值传递到我们的 `vuex` 中，这样岂不是一举两得了。同样的对 `comp2` 做相同修改。运行项目，你会发祥，`comp1 输入框的值`、`comp2 输入框的值` 和 `store 中的值` 实现同步更新了。而且相对与上面的方案，代码量也精简了很多~

## 可配置的 watch

先来看段代码：

```js
// ...
watch: {
    username() {
      this.getUserInfo();
    },
},
methods: {
  getUserInfo() {
    const info = {
      username: 'yugasun',
      site: 'yugasun.com',
    };
    /* eslint-disable no-console */
    console.log(info);
  },
},
created() {
  this.getUserInfo();
},
// ...
```

这里很好理解，组件创建的时候，获取用户信息，然后监听用户名，一旦发生变化就重新获取用户信息，这个场景在实际开发中非常常见。那么能不能再优化下呢？

答案是肯定的。其实，我们在 Vue 实例中定义 `watcher` 的时候，监听属性可以是个对象的，它含有三个属性: `deep`、`immediate`、`handler`，我们通常直接以函数的形式定义时，Vue 内部会自动将该回调函数赋值给 `handler`，而剩下的两个属性值会默认设置为 `false`。这里的场景就可以用到 `immediate` 属性，将其设置为 `true` 时，表示创建组件时 `handler` 回调会立即执行，这样我们就可以省去在 `created` 函数中再次调用了，实现如下：

```js
watch: {
  username: {
    immediate: true,
    handler: 'getUserInfo',
  },
},
methods: {
  getUserInfo() {
    const info = {
      username: 'yugasun',
      site: 'yugasun.com',
    };
    /* eslint-disable no-console */
    console.log(info);
  },
},
```

## Url改变但组件未变时，created 无法触发的问题

首先默认项目路由是通过 [vue-router](https://router.vuejs.org/zh/) 实现的，其次我们的路由是类似下面这样的：

```js
// ...
const routes = [
  {
    path: '/',
    component: Index,
  },
  {
    path: '/:id',
    component: Index,
  },
];
```

公用的组件 `src/views/index.vue` 代码如下：

```html
<template>
  <div class="index">
    <router-link :to="{path: '/1'}">挑战到第二页</router-link><br/>
    <router-link v-if="$route.path === '/1'" :to="{path: '/'}">返回</router-link>
    <h3>{{ username }} </h3>
  </div>
</template>
<script>
export default {
  name: 'Index',
  data() {
    return {
      username: 'Loading...',
    };
  },
  methods: {
    getName() {
      const id = this.$route.params.id;
      // 模拟请求
      setTimeout(() => {
        if (id) {
          this.username = 'Yuga Sun';
        } else {
          this.username = 'yugasun';
        }
      }, 300);
    },
  },
  created() {
    this.getName();
  },
};
</script>
```

两个不同路径使用的是同一个组件 `Index`，然后 Index 组件中的 `getName` 函数会在 `created` 的时候执行，你会发现，让我们切换路由到 `/1` 时，我们的页面并未改变，`created` 也并未重新触发。

> 这是因为 `vue-router` 会识别出这两个路由使用的是同一个组件，然后会进行复用，所以并不会重新创建组件，那么 `created` 周期函数自然也不会触发。

通常解决办法就是添加 `watcher` 监听 `$route` 的变化，然后重新执行 `getName` 函数。代码如下：

```js
watch: {
  $route: {
    immediate: true,
    handler: 'getName',
  },
},
methods: {
  getName() {
    const id = this.$route.params.id;
    // 模拟请求
    setTimeout(() => {
      if (id) {
        this.username = 'Yuga Sun';
      } else {
        this.username = 'yugasun';
      }
    }, 300);
  },
},
```

ok，问题是解决了，但是有没有其他不用改动 `index.vue` 的偷懒方式呢？

就是给 `router-view` 添加一个 `key` 属性，这样即使是相同组件，但是如果 `url` 变化了，Vuejs就会重新创建这个组件。我们直接修改 `src/App.vue` 中的 `router-view` 如下：

```html
<router-view :key="$route.fullPath"></router-view>
```

## 被遗忘的 $attrs

大多数情况下，从父组件向子组件传递数据的时候，我们都是通过 `props` 实现的，比如下面这个例子：

```html
<!-- 父组件中 -->
<Comp3
  :value="value"
  label="用户名"
  id="username"
  placeholder="请输入用户名"
  @input="handleInput"
  >

<!-- 子组件中 -->
<template>
  <label>
    {{ label }}
    <input
      :id="id"
      :value="value"
      :placeholder="placeholder"
      @input="$emit('input', $event.target.value)"
    />
  </label>
</template>
<script>
export default {
  props: {
    id: {
      type: String,
      default: 'username',
    },
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
  },
}
</script>
```

这样一阶组件，实现起来很简单，也没什么问题，我们只需要在子组件的 `props` 中写一遍 `id, value, placeholder...` 这样的属性定义就可以了。但是如果子组件又包含了子组件，而且同样需要传递 `id, value, placeholder...` 呢？甚至三阶、四阶...呢？那么就需要我们在 `props` 中重复定义很多遍了，这怎么能忍呢？

于是 [vm.$attrs](https://cn.vuejs.org/v2/api/#vm-attrs) 可以闪亮登场了，先来看官方解释：

> 包含了父作用域中不作为 prop 被识别 (且获取) 的特性绑定 (class 和 style 除外)。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 (class 和 style 除外)，并且可以通过 v-bind="$attrs" 传入内部组件—— **在创建高级别的组件时非常有用**。

作者还特别强调了 `在创建高级别的组件时非常有用`，他就是为了解决刚才我提到的问题的。它也没什么难度，那么赶紧用起来吧，代码修改如下：

```html
<!-- 父组件中 -->
<Comp3
  :value="value"
  label="用户名"
  id="username"
  placeholder="请输入用户名"
  @input="handleInput"
  >

<!-- 子组件中 -->
<template>
  <label>
    {{ $attrs.label }}
    <input
      v-bind="$attrs"
      @input="$emit('input', $event.target.value)"
    />
  </label>
</template>
<script>
export default {
}
</script>
```

这样看起来是不是清爽多了，而且就算子组件中再次引用类似的子组件，我们也不怕了。因为有了 `$attrs`，哪里不会点哪里......

## 总结

当然 Vuejs 的实践技巧远不止如此，这里只是总结了个人在实际开发中遇到的，而且正好是很多朋友容易忽视的地方。如果你有更好的实践方法，欢迎评论或者发邮件给我，一起交流学习。

[源码在此](https://github.com/yugasun/You-May-Not-Know-Vuejs/blob/master/chapter4/1)

## 专题目录

[You-May-Not-Know-Vuejs](https://github.com/yugasun/You-May-Not-Know-Vuejs#%E6%96%87%E7%AB%A0%E7%9B%B4%E9%80%9A%E8%BD%A6)
