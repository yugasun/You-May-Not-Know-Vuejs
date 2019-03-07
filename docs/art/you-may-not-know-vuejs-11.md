# 自定义路由实现

对于单页面应用，前端路由是必不可少的，官方也提供了 [vue-router 库](https://github.com/vuejs/vue-router) 供我们方便的实现，但是如果你的应用非常简单，就没有必要引入整个路由库了，可以通过 Vuejs 动态渲染的API来实现。

<!--more-->

我们知道组件可以通过 `template` 来指定模板，对于单文件组件，可以通过 `template` 标签指定模板，除此之外，Vue 还提供了我们一种自定义渲染组件的方式，那就是 [渲染函数 render](https://cn.vuejs.org/v2/guide/render-function.html)，具体 `render` 的使用，请阅读官方文档。

接下来我们开始实现我们的前端路由了。

## 简易实现

我们先运行 `vue init webpack vue-router-demo` 命令来初始化我们的项目（注意初始化的时候，不要选择使用 vue-router）。

首先，在 `src` 目录先创建 `layout/index.vue` 文件，用来作为页面的模板，代码如下：

```html
<template>
  <div class="container">
    <ul>
      <li><a :class="{active: $root.currentRoute === '/'}" href="/">Home</a></li>
      <li><a :class="{active: $root.currentRoute === '/hello'}" href="/hello">HelloWord</a></li>
    </ul>

    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'Layout',
};
</script>
<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 15px 30px;
  background: #f9f7f5;
}
a.active {
  color: #42b983;
}
</style>
```

然后，将 `components/HelloWorld.vue` 移动到 `src/pages`，并修改其代码，使用上面创建的页面模板包裹：

```html
<template>
  <layout>
      <!-- 原模板内容 -->
  </layout>
</template>

<script>
import Layout from '@/layout';

export default {
  name: 'HelloWorld',
  components: {
    Layout,
  },
  // ...
};
</script>
<!-- ... -->
```

当然还需要添加一个 `404页面`，用来充当当用户输入不存在的路由时的界面。

最后就是我们最重要的步骤了，改写 `main.js`，根据页面 `url` 动态切换渲染组件。

1.定义路由映射：

  ```js
  // url -> Vue Component
  const routes = {
    '/': 'Home',
    '/hello': 'HelloWorld',
  };
  ```

2.添加 `VueComponent` 计算属性，根据 `window.location.pathname` 来引入所需要组件。

  ```js
  const app = new Vue({
    el: '#app',
    data() {
      return {
        // 当前路由
        currentRoute: window.location.pathname,
      };
    },
    computed: {
      ViewComponent() {
        const currentView = routes[this.currentRoute];
        /* eslint-disable */
        return (
          currentView
            ? require('./pages/' + currentView + '.vue')
            : require('./pages/404.vue')
        );
      },
    },
  });
  ```

3.实现渲染逻辑，render 函数提供了一个参数 `createElement`，它是一个生成 VNode 的函数，可以直接将动态引入组件传参给它，执行渲染。

  ```js
  const app = new Vue({
    // ...
    render(h) {
      // 因为组件是以 es module 的方式引入的，
      // 此处必须使用 this.ViewComponent.default 属性作为参数
      return h(this.ViewComponent.default);
    }
  });
  ```

[最终实现代码](https://github.com/yugasun/You-May-Not-Know-Vuejs/blob/master/chapter3/vue-router/simple)

## history 模式

简易版本其实并没有实现前端路由，点击页面切换会重新全局刷新，然后根据 `window.location.pathname` 来初始化渲染相应组件而已。

接下来我们来实现前端路由的 `history` 模式。要实现页面 URL 改变，但是页面不刷新，我们就需要用到 [history.pushState()](https://developer.mozilla.org/zh-CN/docs/Web/API/History/pushState) 方法，通过此方法，我们可以动态的修改页面 URL，且页面不会刷新。该方法有三个参数：一个状态对象，一个标题（现在已被忽略），以及可选的 URL 地址，执行后会触发 `popstate` 事件。

那么我们就不能在像上面一样直接通过标签 `a` 来直接切换页面了，需要在点击 `a` 标签是，禁用默认事件，并执行 `history.pushState()` 修改页面 `URL`，并更新修改 `app.currentRoute`，来改变我们想要的 `VueComponent` 属性，好了原理就是这样，我们来实现一下。

首先，编写通用 `router-link` 组件，实现上面说的的 `a` 标签点击逻辑，添加 `components/router-link.vue`，代码如下：

```html
<template>
  <a
    :href="href"
    :class="{active: isActive}"
    @click="go"
  >
    <slot></slot>
  </a>
</template>
<script>
import routes from '@/routes';

export default {
  name: 'router-link',
  props: {
    href: {
      type: String,
      required: true,
    },
  },
  computed: {
    isActive() {
      return this.href === this.$root.currentRoute;
    },
  },
  methods: {
    go(e) {
      // 阻止默认跳转事件
      e.preventDefault();
      // 修改父级当前路由值
      this.$root.currentRoute = this.href;
      window.history.pushState(
        null,
        routes[this.href],
        this.href,
      );
    },
  },
};
</script>
```

对于 `src/main.js` 文件，其实不需要做什么修改，只需要将 `routes` 对象修改为模块引入即可。如下：

```js
import Vue from 'vue';

// 这里将 routes 对象修改为模块引入方式
import routes from './routes';

Vue.config.productionTip = false;

/* eslint-disable no-new */
const app = new Vue({
  el: '#app',
  data() {
    return {
      currentRoute: window.location.pathname,
    };
  },
  computed: {
    ViewComponent() {
      const currentView = routes[this.currentRoute];
      /* eslint-disable */
      return (
        currentView
          ? require('./pages/' + currentView + '.vue')
          : require('./pages/404.vue')
      );
    },
  },
  render(h) {
    // 因为组件是以 es module 的方式引入的，
    // 此处必须使用 this.ViewComponent.default 属性作为参数
    return h(this.ViewComponent.default);
  },
});
```

好了，我们的 `history` 模式的路由已经修改好了，点击头部的链接，页面内容改变了，并且页面没有刷新。

但是有个问题，就是当我们点击浏览器 `前进/后退` 按钮时，页面 URL 变化了，但是页面内容并没有变化，这是怎么回事呢？
因为当我们点击浏览器 `前进/后退` 按钮时，`app.currentRoute` 并没有发生改变，但是它会触发 [popstate](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/onpopstate) 事件，所以我们只要监听 `popstate` 事件，然后修改 `app.currentRoute` 就可以了。

既然需要监听，我们就直接添加代码吧，在 `src/main.js` 文件末尾添加如下代码：

```js
window.addEventListener('popstate', () => {
  app.currentRoute = window.location.pathname;
});
```

这样我们现在无论是点击页面中链接切换，还是点击浏览器 `前进/后退` 按钮，我们的页面都可以根据路由切换了。

[最终实现代码](https://github.com/yugasun/You-May-Not-Know-Vuejs/blob/master/chapter3/vue-router/history)

## hash 模式

既然实现 `history 模式`，怎么又能少得了 `hash 模式` 呢？既然你这么问了，那我还是不辞劳苦的带着大家实现一遍吧（卖个萌~）。

什么是 URL hash 呢？来看看 MDN 解释：

> Is a DOMString containing a '#' followed by the fragment identifier of the URL.

也就是说它是页面 URL中 以 `#` 开头的一个字符串标识。而且当它发生变化时，会触发 `hashchange` 事件。那么我们可以跟 `history 模式` 一样对其进行监听就行了，对于 `history 模式`，
这里需要做的修改无非是 `src/routes.js` 的路由映射如下：

```js
export default {
  '#/': 'Home',
  '#/hello': 'HelloWorld',
};
```

给 `src/layout/index.vue` 中的链接都添加 `#` 前缀，然后在 `src/main.js` 中监听 `hashchange` 事件，当然还需要将 `window.location.hash` 赋值给 `app.currentRoute`：

```js
window.addEventListener('hashchange', () => {
  app.currentRoute = window.location.hash;
});
```

最后还有个问题，就是单个面初始化的时候，`window.location.hash` 值为空，这样就会找不到路由映射。所以当页面初始化的时候，需要添加判断，如果 `window.location.hash` 为空，则默认修改为 `#/`，这样就全部完成了。

[最终实现代码](https://github.com/yugasun/You-May-Not-Know-Vuejs/blob/master/chapter3/vue-router/hash)

## 不同模式切换版本

实际开发中，我们会根据不同项目需求，使用不同的路由方式，这里就需要我们添加一个 `mode` 参数，来实现路由方式切换，这里就不做讲解了，感兴趣的读者，可以自己尝试实现下。


## 总结

实际上，一个完整的路由库，远远不止我们上面演示的代码那么简单，还需要考虑很多问题，但是如果你的项目非常简单，不需要很复杂的路由机制，自己实现一遍还是可以的，毕竟 `vue-router.min.js` 引入进来代码体积就会增加 `26kb`，具体如何取舍，还是视需求而定。

> 尽信书，不如无书，当面对 `问题/需求` 时，多点自主的思考和实践，比直接接受使用要有用的多。

## 专题目录

[You-May-Not-Know-Vuejs](https://github.com/yugasun/You-May-Not-Know-Vuejs#%E6%96%87%E7%AB%A0%E7%9B%B4%E9%80%9A%E8%BD%A6)
