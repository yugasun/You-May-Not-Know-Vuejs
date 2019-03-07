# 组件式开发

## 初识组件

组件（Component）绝对是 Vue 最强大的功能之一。它可以扩展HTML元素，封装可复用代码。从较高层面讲，可以理解组件为自定义的HTML元素，Vue 的编译器为它添加了特殊强大的功能。所有的 Vue 组件同时也都是 Vue 的实例，因此可以接受相同的选项对象（除了一些特有的选项）并提供相同的生命周期函数。

<!--more-->

再来回顾下 [你也许不知道的Vuejs - 花式渲染目标元素](https://yugasun.com/post/you-may-not-know-vuejs-1.html) 中的代码：

```html
<div id="app1">
  <helloworld/>
</div>
```

```js
Vue.component("helloworld", {
  template: "<h1>{{ msg }}</h1>",
  data () {
    return {
      msg: "Hello Vue.js!"
    }
  }
})
var app1 = new Vue({
  el: "#app1"
})
```

上面通过 `Vue.component` 注册了一个全局组件，然后在 `div#app` 元素内通过 `<helloworld/>` 标签直接使用。可以看出，这里就是相当于自定义了一个 HTML 元素 `helloworld`，它的功能就是输出一个内容为 `msg` 的 `h1` 标签。这就是一个基本全局组件的定义方式，当然你也可以注册为局部组件：

```js
var app2 = new Vue({
  el: "#app2",
  components: {
    'helloworld': {
      template: "<h1>{{ msg }}</h1>",
      data () {
        return {
          msg: "Hello Vue.js!"
        }
      }
    }
  }
})
```

无论是全局或者局部注册组件，它跟上一篇中的指令注册是非常相似的。局部注册组件就是在创建 Vue 实例的时候添加一个 `components` 对象属性，它的键值对就是一个自定义组件，键是组件名，值是创建组建的配置对象参数。当然也可以将组件定义放到单独的文件，然后通过引入的方式，然后添加到components属性中，这个在单文件组件中会具体讲到。

## 组件间通信

既然说到组件，就不得不说组件间通信了，实际开发中，我们经常需要在不同组件间传递/共享数据，所以实现组件间通信是非常重要的。

组件间关系可以总结为 `父子组件` 和 `非父子组件`，自然通信方式也就是这两种了。

### 父子组件间通信

![](https://static.yugasun.com/props-events.png)

如上图，在 Vue 中，父子组件的关系可以总结为 `props向下传递，事件向上传递`。也就是父组件通过 `prop` 给子组件下发数据，子组件通过 [$emit](https://cn.vuejs.org/v2/api/#vm-emit) 事件, 给父组件发送数据。先来看个例子：

```html
<div id="app3">
  当前输入内容：{{ text }}<br>
  <com-input :text="text" v-on:change="handleChange"/>
</div>
```

```js
Vue.component('com-input', {
  props: {
    text: {
      type: String,
      default: "请输入"
    }
  },
  template: '<input v-on:change="handleChange" v-model="msg"/>',
  data () {
    return {
      // 这里定义为 input 的 v-model绑定值
      msg: this.text
    }
  },
  methods: {
    // 当input值变化时，执行函数，通过 $emit change 事件，
    // 父级组件通过 v-on:change 来监听此事件，执行相关操作
    handleChange (e) {
      this.$emit('change', this.msg)
    }
  }
})
var app3 = new Vue({
  el: "#app3",
  data () {
    return {
      text: 'Hello Vue.js'
    }
  },
  methods: {
    handleChange (val) {
      this.text = val
    }
  }
})
```

> 原理解析：上面的代码中，先通过 `Vue.component` 定义了 `com-input` 组件，给它添加了 `props` 属性，用来接收父级通过属性传递的属性数据 `text`，这里 `text` 是个对象，含有 `type - 属性值类型` 和 `default - 默认值` 两个属性。当然 `props` 也可以为所有从父级接受的属性数组，有关 `props` 基础知识请直接阅读 [官方文档](https://cn.vuejs.org/v2/api/#props)。然后将初始值赋值给了 data 中的 `msg`，该子组件的模板是个 `input`，通过 `v-model` 实现 `input的值` 和 `msg` 的双向绑定，当input值变化时，通过 `this.$emit('change', this.msg)`，发出 `change` 事件，同时将当前值作为监听器回调参数，这样父级组件就可以通过 `v-on:change` 来监听此事件，获取修改后的值，执行相关操作了。

虽然这段代码同时实现了上述图片中的 `父 -> 子` 和 `子 -> 父` 通信流程，但是代码还是比较繁琐的，单纯实现单个数据的循环传递，就需要父子组件同时监听改变事件，执行监听回调函数，是不是太麻烦了。要是能直接修改 `props` 中的 `text` 值就好了，实践证明，这是不行的，因为直接修改，会报下面错误（注意只有引入 `vue.js` 文件才会出现，因为 `vue.min.js` 文件移除了 `[Vue warn]` 错误提示功能）：

> [Vue warn]: Avoid mutating a prop directly since the value will be overwritten whenever the parent component re-renders. Instead, use a data or computed property based on the prop's value. Prop being mutated: "text"

这个问题，Vue 作者早就想到了，那就是使用 [.sync](https://cn.vuejs.org/v2/guide/components.html#sync-%E4%BF%AE%E9%A5%B0%E7%AC%A6) 修饰符。早在 `1.x` 版本中此功能是一直存在的，但是作者认为它破坏了 **单向数据流** 的原则，所以 `2.0` 发布后，就移除了该修饰符，但是后来发现在实际开发中，有很多相关需求， 于是在 `2.3.0+` 版本后，又重新引入了 `.sync` 修饰符，不过内部实现是跟 `1.x` 版本有区别的，它并没有破坏 **单向数据流** 原则，实际上内部就是帮我们实现了父级组件监听和修改相关属性值的操作。

使用 `.sync` 修改后的代码如下：

```html
<div id="app4">
  当前输入内容：{{ text }}<br>
  <com-input2 v-bind:text.sync="text"/>
</div>
```

```js
Vue.component('com-input2', {
  props: {
    text: {
      type: String,
      default: "请输入"
    }
  },
  template: '<input v-on:change="handleChange" v-model="msg"/>',
  data () {
    return {
      msg: this.text
    }
  },
  methods: {
    handleChange (e) {
      this.$emit('update:text', this.msg)
    }
  }
})
var app4 = new Vue({
  el: "#app4",
  data () {
    return {
      text: 'Hello Vue.js'
    }
  }
})
```

这次我们只是将子组件的 `$emit` 事件名修改为 `update:text`，并删除了父级组件 `v-on:change` 监听和相关监听回调，并在模板中 `v-bind:text` 后面添加了 `.sync` 修饰符，这样就是实现了相同的功能，代码确实精简了很多。实际上 Vue 在编译含有 `.sync` 修饰符的 `v-bind` 指令时，会自动实现监听 `update` 事件的相关代码，也就是：

```html
<com-input2 v-bind:text.sync="text"/>
```

会被扩展为：

```html
<com-input2 v-bind:text="text" v-on:update="val => text = val"/>
```

> 注意：`val => text = val` 是箭头函数，关于箭头函数的介绍可以看这里：[箭头函数](http://es6.ruanyifeng.com/#docs/function#%E7%AE%AD%E5%A4%B4%E5%87%BD%E6%95%B0)

这样一解析就很好理解了，全部是我们上一节讲到的内容。


### 非父子组件间通信

如果是两个非父子组件，并且有共同的父级组件，那么它拆解为 `子 -> 父 -> 子 ` 的过程，这个就完全可以使用 `父子组件间通信` 方法实现。如果是多个组件或者不同父组件的组件间通信，这时我们可以借助创建空的 Vue 实例作为事件总线，通过 `发布订阅模式` 进行数据传递。 代码如下：

```html
<div id="app5">
  组件A: <com-a></com-a><br>
  组件B: <com-b></com-b>
</div>
```

```js
var bus = new Vue()
Vue.component('com-a', {
  template: '<input v-on:change="handleChange" v-model="msg"/>',
  data () {
    return {
      msg: 'Hello Vue.js'
    }
  },
  methods: {
    handleChange() {
      bus.$emit('a-change', this.msg)
    }
  },
  created () {
    var me = this
    bus.$on('b-change', function (msg) {
      me.msg = msg
    })
  }
})
Vue.component('com-b', {
  template: '<input v-on:change="handleChange" v-model="msg"/>',
  data () {
    return {
      msg: 'Hello Vue.js'
    }
  },
  methods: {
    handleChange() {
      bus.$emit('b-change', this.msg)
    }
  },
  created () {
    var me = this
    bus.$on('a-change', function (msg) {
      me.msg = msg
    })
  }
})
var app5 = new Vue({
  el: '#app5'
})
```

熟悉 `发布订阅模式` 的同学，应该很容易理解上面这段代码，创建的全局空 Vue 实例 `bus` 就是用来充当中央事件总线，所有的事件都经过它来触发和传播。

> 思路解析：在组件 `com-a` 中，当 `input` 值发生改变时，通过 `bus.$emit('a-change', this.msg)` 来触发修改事件，并将其更新后的值做为参数传递，组件 `com-b` 通过 `bus.$on('a-change', xxx)` 来监听，进行值更新操作，组件 `com-b` 也是相同原理。

当然在复杂情况下，我们应该考虑使用专门的 [状态管理模式](https://cn.vuejs.org/v2/guide/state-management.html)，比如 [vuex](https://vuex.vuejs.org/zh-cn/intro.html)，这个将在后续的文章中讲到。


## 动态组件

Vue 中还提供了 `component` 元素，允许我们在实际开发中，通过修改其 `is` 属性值，来动态切换组件。这个在某些应用场景非常实用，笔者曾经有个需求就是，需要根据参数 `type` 来绘制不同类型的图表，而我的所有图表类型都已经装成了一个独立的组件，所以我只需要依据此特性，通过参数 `type` 来动态修改元素 `component` 的属性 `is` 为对应的组件名称即可。

下面来看示例代码：

```html
<div id="app6">
  <button v-on:click="changeType">改变组件</button><br>
  <component v-bind:is="currentComp"></component>
</div>
```

```js
var app6 = new Vue({
  el: '#app6',
  data () {
    return {
      type: 'a'
    }
  },
  computed: {
    currentComp () {
      return this.type === 'a' ? 'com-a' : 'com-b';
    }
  },
  components: {
    'com-a': {
      template: '<h1>我是组件a</h1>'
    },
    'com-b': {
      template: '<h1>我是组件b</h1>'
    }
  },
  methods: {
    changeType () {
      this.type = this.type === 'a' ? 'b' : 'a';
    }
  }
})
```

运行上面代码，点击改变组件按钮，就可以轻松的实现组件 `com-a` 和 `com-b` 的动态切换了，是不是很酷？赶紧动手尝试下吧。

## 总结

组件作为 Vue 中最强大的功能之一，其特性当然不止上面所提到的，感兴趣的同学可以到官方文档中阅读了解。学会封装可重用的代码，增加代码可复用性，是个需要长期学习和总结的过程，这个就需要我们在不断的项目开发中尝试和总结。本节也是关于 Vue 基础知识的最后一节，当然还有很多 Vue 的基础知识，文章中并未提到，因为官方文档已经非常详细了，篇幅有限，也不再一一介绍。请至少将官方文档仔细阅读一篇，以便理解后面的项目实战开发。从下一篇开始，我将进行实际项目开发讲解，尽请期待~


[源码在此](https://github.com/yugasun/You-May-Not-Know-Vuejs/blob/master/chapter1/4.html)

## 专题目录

[You-May-Not-Know-Vuejs](https://github.com/yugasun/You-May-Not-Know-Vuejs#%E6%96%87%E7%AB%A0%E7%9B%B4%E9%80%9A%E8%BD%A6)
