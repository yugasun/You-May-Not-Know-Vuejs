import Vue from 'vue';
// 引入插件
import VueAxiosPlugin from 'vue-axios-plugin';

import './styles/app.scss';
import userinfo from './info';
import { deepClone, log as logger } from './utils';
import hello1 from './hello1.vue';
import hello2 from './hello2.vue';


// 使用插件
Vue.use(VueAxiosPlugin);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<div class="app"><hello1 v-bind:info="userinfo"/><hello2/></div>',
  data() {
    return {
      userinfo: deepClone(userinfo),
    };
  },
  components: {
    hello1,
    hello2,
  },
  created() {
    // 你会发现这里也同时改变了源原数据 info ，
    // 所以需要用到深拷贝源数据赋值给 data 中的 info
    logger('App created');
  },
});
