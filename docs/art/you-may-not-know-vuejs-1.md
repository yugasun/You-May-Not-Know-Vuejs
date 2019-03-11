# 花式渲染目标元素

## Vue.js是什么

摘自官方文档：

> Vue (读音 /vjuː/，类似于 view) 是一套用于构建用户界面的渐进式框架。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。另一方面，当与现代化的工具链以及各种支持类库结合使用时，Vue 也完全能够为复杂的单页应用提供驱动。

<!--more-->

## 对比其他框架？

一般提到一个框架时，大家都喜欢跟其他框架作对比，以说服读者去使用它，但是这里就不做对比了，是不是很失望？每个人都有每个人的好，何况是由人创造出来的框架呢，单凭 [vuejs](https://github.com/vuejs/vue) 在github上8W+的star，那也值得你去尝试一回，不是吗？

当然如果你有框架选择恐惧症，那么不妨相信我一回，直接跟着我亲自上手体验吧~

## 起步

其实使用 Vuejs 很简单，直接像引入 `jquery` 方式一样，引入源码标签就行，如下：

```html
<!-- 这里直接引入cdn源码，当然你也可把它下载下来，直接引入 -->
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```

每个Vue应用都是通过 `Vue` 函数创建一个新的 `Vue实例` 开始的。

接下来，我们来创建一个最基本的应用，实现在页面中输出 `Hello Vue.js!`。新建一个html文件代码如下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>You Don't Know Vuejs - Chapter 1</title>
</head>
<body>
  <div id="app"></div>
  <!-- 这里直接引入cdn源码，当然你也可把它下载下来，直接引入 -->
  <script src="https://cdn.jsdelivr.net/npm/vue"></script>
  <script>
    var app = new Vue({
      el: "#app",
      template: "<h1>Hello Vue.js!</h1>"
    });
  </script>
</body>
</html>
```

使用浏览器打开刚创建的 `index.html` ，页面会输出一个大大的 `h1` 标签，内容就是我们期待的 `Hello Vue.js!`，怎么样是不是很简单。Vue实例在创建的时候需要传入一个对象作为参数，这个对象有很多属性，包括: DOM渲染相关属性（el、template...），数据相关属性（data、props、computed、methods、watch...），生命周期钩子属性（created、mounted...）...等很多属性，具体可以参考 [官方API文档](https://cn.vuejs.org/v2/api/)，这里刚好用到了 `el - Vue实例需要挂在的目标DOM元素`，`template - 替换挂在元素的内容模板` 。也就是当我们创建Vue实例的时候，它会找到 `el` 提供的元素 `div#app`（这里app可以取任意你喜欢的名称，也可以使用类名，但是为了确保不发生冲突和唯一性，最好使用ID名称），然后使用 `template` 属性的内容将其替换。

## 数据绑定

当然实际开发中我们的模板不可能是硬编码的方式替换，并且也不可能保持一成不变，既然Vuejs声称是数据驱动视图（MVVM）的响应式框架，我们当然要体验一番了。接下来我们来体验下数据绑定和模板语法。

在创建Vuejs实例是我们提到过的 `data` 属性就是用来进行数据对象绑定的，我们将上面初始化代码修改如下：

```js
var app = new Vue({
  el: "#app",
  template: "<h1>{{ msg }}</h1>",
  data () {
    return {
      msg: "Hello Vue.js!"
    }
  }
});
```

然后刷新页面，发现实现效果是一样的。这里的 `data` 为一个返回数据对象的函数，当Vue实例创建的时候，会执行该函数，将在实例上添加 `$data` 属性，并在编译模板 `template` 的时候，将所有双大括号（Mustache语法）的内容替换为我们定义的属性值。

> 注意：当创建Vue实例时，data 必须声明为返回一个初始数据对象的函数，因为组件可能被用来创建多个实例。如果 data 仍然是一个纯粹的对象，则所有的实例将共享引用同一个数据对象！通过提供 data 函数，每次创建一个新实例后，我们能够调用 data 函数，从而返回初始数据的一个全新副本数据对象。

## Too young too simple?

好了，看到这里我想大家都学会如何使用Vuejs了，有人会说了，纳尼？一脸茫然，还没开始就结束了。是的没错，基础知识我们就讲到这里了，因为我不可能将vuejs官方文档都重写一遍，那样太浪费大家时间了，而且官方文档写的实在是太好了，推荐每个人都必须去读一遍。那么问题来了：那么你凭什么这么辛苦跑来读我的文章......说好的 `You Don't Know Vuejs` 呢？

那么本文就正式开始吧......

ORZ......这个开场白确实有点长，不过还是有必要的，毕竟要考虑到小白们的感受，大家体谅下。

## 花式渲染目标元素

上面介绍了最基本的用法，也是最常见的方式，其实Vue对象上还好提供很多种方法，如下：

1.[Vue](https://cn.vuejs.org/v2/guide/instance.html)

直接创建Vue实例，这个方法很简单，代码如下：

```js
new Vue({
  el: "#app",
  template: "<h1>{{ msg }}</h1>",
  data () {
    return {
      msg: "Hello Vue.js!"
    }
  }
})
```

2.[Vue.extend](https://cn.vuejs.org/v2/api/#Vue-extend)

Vue.extend(options) 方式是使用Vue构造器的一个“子类”，其参数同Vue(options)一模一样，唯一的不同是没有 `el` 属性来指定挂载的DOM元素，所以这里需要通过 `$mount()` 方法，来手动实现挂载。将以上代码修改如下：

```js
var app = Vue.extend({
  template: "<h1>{{ msg }}</h1>",
  data () {
    return {
      msg: "Hello Vue.js!"
    }
  }
})
new app().$mount('#app');
```

注意这里 `Vue.extend` 方式是生成了一个 `Vue` 子类，所以需要 `new` 关键字来重新创建，然后手动挂载。

3.[Vue.component](https://cn.vuejs.org/v2/api/#Vue-component)

Vue.component(id, [definition]) 方式是注册一个名称为 `id` 的全局组件，然后我们可以通过使用该组件来，实现目标元素渲染。其中 `definition` 参数同 `Vue.extend` 中的参数一模一样，方法一样，需要使用 `$mount()` 方法手动挂在。修改代码如下

```js
var app = Vue.component('helloworld', {
  template: "<h1>{{ msg }}</h1>",
  data () {
    return {
      msg: "Hello Vue.js!"
    }
  }
})
new app().$mount('#app')
```

既然 `Vue.component` 是帮我们注册了一个全局组件，那么我们当然是可以通过使用它来渲染了。修改如下：

```js
// 1. 注册组件
Vue.component('helloworld', {
  template: "<h1>{{ msg }}</h1>",
  data () {
    return {
      msg: "Hello Vue.js!"
    }
  }
})
// 2. 通过创建Vue实例来使用
new Vue({
  el: '#app4',
  template: "<helloworld/>"
})
```

需要注意的是，仅仅注册组件式不够的，我们还要通过创建一个Vue实例，才能使用该组件。

4.[Vue.directive](https://cn.vuejs.org/v2/api/#Vue-directive)

在Vue中可以通过 `Vue.directive(id, [definition])` 来自定义一个指令，并且指令的使用是通过在目标元素中添加 `v-指令id`属性来实现的。修改代码如下：

在 `div#app` 元素添加指令，如下：

```html
<div v-helloworld="msg"></div>
```
然后修改js代码：

```js
Vue.directive("helloworld", {
  bind: function (el, binding) {
    el.innerHTML = "<h1>"+ binding.value +"</h1>"
  }
})
new Vue({
  el: "#app",
  data () {
    return {
      msg: "Hello Vue.js!"
    }
  }
})
```

5.[Vue.compile](https://cn.vuejs.org/v2/api/#Vue-compile)

`Vue.compile(template)` 参数也就是方法1中的 `template` 模板字符串属性，然后通过替换 Vue实例的 `render` 函数，来实现渲染，代码如下：

```js
var tpl = Vue.compile('<h1>{{ msg }}</h1>')
new Vue({
  el: "#app",
  data () {
    return {
      msg: "Hello Vue.js!"
    }
  },
  render: tpl.render
})
```

其实此方法本质上跟方法1是一样的，只是方法1中通过 `template` 属性来定义模板，Vue实例在创建的过程中也会调用 `render` 函数，然后会默认使用 `template` 的模板值来渲染，而方法5则手动指定了渲染模板。

当然，你也可以直接通过修改 `render` 函数，来定制化输出内容，这就是接下来要讲到的方法6。

6.[render](https://cn.vuejs.org/v2/api/#render)

Vue实例在创建的过程中也会调用 `render` 函数，`render` 函数默认会传递一个参数，这里我取名为 `createElement`， 我们可以通过 `createElement` 来动态创建一个 [VNode](https://github.com/vuejs/vue/blob/dev/src/core/vdom/vnode.js)，以此来渲染目标元素。代码如下：

```js
new Vue({
  el: "#app6",
  data () {
    return {
      msg: "Hello Vue.js!"
    }
  },
  render: function (createElement) {
    return createElement('h1', this.msg)
  }
})
```

## 总结

花式渲染目标元素介绍就到这里吧，虽然上面书写的是6中方式，实则实现了7种方法，当然如果你有不同的方式或者觉得有不对的地方，欢迎评论或者发邮件回复~

[源码在此](https://github.com/yugasun/You-May-Not-Know-Vuejs/blob/master/chapter1/1.html)

## 专题目录

[You-May-Not-Know-Vuejs](https://github.com/yugasun/You-May-Not-Know-Vuejs#%E6%96%87%E7%AB%A0%E7%9B%B4%E9%80%9A%E8%BD%A6)
