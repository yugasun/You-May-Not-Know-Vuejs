---
title: 你也许不知道的Vuejs - 最佳实践(3)
desc: 关于Vuejs项目实战经验分享，一步一步带你学会用Vuejs框架开发项目。
reward: true
tags:
  - Vuejs
  - You-May-Not-Know-Vuejs
date: 2019-03-04 17:26:36
---

> by [yugasun](https://yugasun.com) from [https://yugasun.com/post/title.html](https://yugasun.com/post/title.html)
本文可全文转载，但需要保留原作者和出处。

相信大多数使用 Vue 项目都会面临国际化的问题，而 [vue-i18n](https://github.com/kazupon/vue-i18n) 便是国际化的不二之选，它是用来非常简单，但是同时也会带来一些问题和挑战。本篇是个人在项目上国际化时一些经验的总结，希望能在国际化的道路上帮到你。

<!--more-->

## 基本使用

`vue-i18n` 使用起来很简单，现在 `src/lang` 目录下分别创建三个文件 `index.js`，`zh.js`，`en.js`，
`index.js` 用来创建 `i18n` 实例，并导出供 Vue 使用，代码如下：

```js
import Vue from 'vue';
import VueI18n from 'vue-i18n';

import zhMsg from './zh';
import enMsg from './en';

Vue.use(VueI18n);

const messages = {
  zh: {
    ...zhMsg,
  },
  en: {
    ...enMsg,
  },
};

const i18n = new VueI18n({
  locale: 'zh',
  messages,
});

export default i18n;
```

接着编写语言包文件:

```js
// zh.js
export default {
  index: {
    header: {
      title: 'Vue-I18n 示例',
      subtitle: '你将学会如何使用 vue-i18n',
    },
  },
};

// en.js
export default {
  index: {
    header: {
      title: 'Vue-I18n Demo',
      subtitle: 'You will learn how to use vue-i18n',
    },
  },
};
```

接下在在入口文件 `src/main.js` 文件中引入：

```js
// ...
import i18n from './lang';

// ...
new Vue({
  i18n,
  router,
  el: '#app',
  template: '<App/>',
  components: { App },
});
```

到这里就配置好了，接下在我们就可以在组件中使用语言包了，使用方法如下(src/views/index.vue)；

```html
<h1>{{ $t('index.header.title') }} </h1>
<h3>{{ $t('index.header.subtitle') }} </h3>
```

看起来是不是很简单，引入 `vue-i18n` 后，它会在 `Vue` 实例上挂载它提供的国际化的 api，比如 `$t、$tc、$td` 等格式化方法。使用时我们只需要在组件中直接 `this.$t` 调用就行。

`$t` 接受两个参数，第一个为我们在语言包中访问的属性路径，各级属性用 `.` 符号链接，第二个参数可以动态传参，比如我们将 `index.header.subtitle` 的模板修改为 `You will learn how to use {name}`，那么我们在使用的时候如下所示：

```js
$t('index.header.subtitle', {name: 'vue-i18n})
```

## 小技巧

### 获取键值集合

相信大家已经知道 `vue-i18n` 如何使用了，建议阅读 [官方文档](https://kazupon.github.io/vue-i18n/started.html)，自己一步一步配置熟悉下。大多数情况下，我们只需要使用 `$t` 就可以满足我们的需求了。但是当我们的的语言包层级原来越深时，你会发现属性路径越来越长，而且在某些组件内，需要书写很多遍，比如上面的 `index.header.title` 和 `index.header.subtitle`，它们的前缀都是 `index.header`，在这里写两遍我们能接受，如果是100遍呢？作为一名懒惰的程序员，怎么能接受同样的事情做3遍呢，更何况是100遍，简直不敢想象。

其实我们可以先获取前缀的对象集合，然后通过这个集合对象来访问，方便节省臃长的前缀的重复书写，使用的时候我们现在 `src/views/index.vue` 组件的 `computed` 中定义国际化集合：

```js
export default {
  name: 'Index',
  computed: {
    indexMsg() {
      return this.$t('index.header')
    }
  },
};
```

接下来修改下模板中的书写方式：

```html
<h1>{{ indexMsg.title }}</h1>
<h3>{{ indexMsg.subtitle }} </h3>
```

> 注意：这里必须定义为计算属性，不然在切换语言时，视图将无法刷新。

### 多元化的消息

最近在做一个登录错误信息提示的时候，遇到个需求：用户多次输入错误后，会提示多长时间后重试，但是接口只是返回个剩余秒数，产品需要根据这个秒数计算出剩余的时分秒，当大于1小时时，提示 `请 xx 小时后重试`，当小于1小时时，提示 `请 xx 分 xx 秒后重试`。一般碰到这种需求，我们是肯定需要结合模板变量的，然后可以直接定义两个国际化键值，比如 `msg1，msg2`，然后通过计算出的小时来做 `if` 判断就行，这当然可以解决需求。

但是当项目越来越庞大，项目中类似的需求越来越多的时候，你会发现你的语言包的键值对越来越多，到了最后，取个属性名就好想半天，不知道大家有没有跟我类似的痛点，所以我对于这种类似需求用 `$tc` 函数来实现的。

`$tc` 函数允许我们一个国际化键值可以通过管道符 `|` 来分割多种信息，如下：

```js
export default {
  // ...
  login: {
    tips: '请{minute}分{second}秒后再重试 | 请{hour}小时后再重试',
  },
};
```

然后在模板中使用如下：

```html
<p>{{ $tc('login.tips', 1, {minute: 30, second: 29}) }}</p>
<p>{{ $tc('login.tips', 2, {hour: 1}) }}</p>
```

所以对于上面的需求，我只需要在接口返回的秒数，计算下 `hour` 值，然后写一个三目运算就解决了：

```js
hour >= 1 ? this.$tc('login.tips', 2, {hour: 1}) : this.$tc('login.tips', 1, {minute: 30, second: 29})
```

### 可选数组消息

其实对于可选的国际化消息需求，我们还可以通过数组来实现，比如我们的某个订单消息需要国际化，`0-5` 分别对应不同的状态，我们只需要定义简单的数组就可以搞定了。

首先定义语言包：

```js
export default {
  //...
  order: {
    status: [
      '待付款',
      '待发货',
      '已发货',
      '已签收',
      '已取消',
    ],
  },
};
```

然后我们只需要根据不同状态，来读取键值就行：

```html
<span>{{ $t('order.status[0]') }}</span>
<span>{{ $t('order.status[1]') }}</span>
```

当然这里也可以通过多元化的方式来实现，大家可以自行尝试下。

## 模块化

随着项目越来越大，你会发现 `src/lang/zh.js` 文件越来越臃肿，每次改个国际化文案，需要在上千行的对象中找半天对应的键值对，而且那深不可测的属性层级，着实让人眼花缭乱。

`src/lang/zh.js` 既然是 `js` 文件，我们就可以对其进行拆分，然后把不同的模块拆分成独立的 js 文件进行维护，是不是找起来会轻松好多，比如我们尝试将实例中的 `zh.js` 产分成 `src/lang/zh-modules/index.js`、`src/lang/zh-modules/login.js`、 `src/lang/zh-modules/order.js` 三个模块文件：

```js
// index.js
export default {
  index: {
    header: {
      title: 'Vue-I18n 示例',
      subtitle: '你将学会如何使用 vue-i18n',
    },
  },
};


// login.js
export default {
  login: {
    tips: '请{minute}分{second}秒后再重试 | 请{hour}小时后再重试',
  },
};

// order.js
export default {
  order: {
    status: [
      '待付款',
      '待发货',
      '已发货',
      '已签收',
      '已取消',
    ],
  },
};
```

然后在 `src/lang/zh.js` 文件中一次引入：

```js
import index from './zh-modules/index';
import login from './zh-modules/login';
import order from './zh-modules/order';

export default {
  ...index,
  ...login,
  ...order,
};
```

这样是不是变得清晰很多，下次产品需要你修改登录相关的文案，你只需要修改 `login.js` 模块就行。

但是拆分到这，有人就会有疑问了，我这么拆分后，我的语言模块文件会随着语言种类成倍数增加，应该怎么办？

这里我就说说我的解决办法，就是将语言文件按模块合并。所谓 `天下大势，合久必分，分久必合`。我们将相同的模块按文件合并起来就可以了，比如 `index` 模块：

```js
const zh = {
  index: {
    header: {
      title: 'Vue-I18n 示例',
      subtitle: '你将学会如何使用 vue-i18n',
    },
  },
};
const en = {
  index: {
    header: {
      title: 'Vue-I18n Demo',
      subtitle: 'You will learn how to use vue-i18n',
    },
  },
}
export default {
  zh,
  en,
};
```

然后只需要在 `src/lang/index.js` 引入，稍作修改就行：

```js
import Vue from 'vue';
import VueI18n from 'vue-i18n';

import indexMsg from './modules/index';
import loginMsg from './modules/login';
import orderMsg from './modules/order';

Vue.use(VueI18n);

const messages = {
  zh: {
    ...indexMsg.zh,
    ...loginMsg.zh,
    ...orderMsg.zh,
  },
  en: {
    ...indexMsg.en,
    ...loginMsg.en,
    ...orderMsg.en,
  },
};

const i18n = new VueI18n({
  locale: 'zh',
  messages,
});

export default i18n;
```

此时你会发现我们已经不需要 `src/lang/zh.js` 和 `src/lang/en.js` 文件了，而且这里有个好处是，我们在让翻译帮忙的事后，只需要在同一个文件中对我们的相同键值进行修改和编辑了，是不是方便很多，赶紧动手尝试下吧~

## 总结

本文只是个人在开发过程中，关于国际化方案的经验总结，我相信大家也有很多提高效率的方案。希望本篇能够解决你在开发中遇到的一些疑惑和痛点，也非常欢迎评论或来信交流你的优化方案。

[源码在此](https://github.com/yugasun/You-May-Not-Know-Vuejs/blob/master/chapter4/3)

## 专题目录

[You-May-Not-Know-Vuejs](https://github.com/yugasun/You-May-Not-Know-Vuejs#%E6%96%87%E7%AB%A0%E7%9B%B4%E9%80%9A%E8%BD%A6)
