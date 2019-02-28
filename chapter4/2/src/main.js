// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.mixin({
  created() {
    console.log(`Component ${this.$options.name} created from 全局打点`);
  },
  mounted() {
    console.log(`Component ${this.$options.name} mounted from 全局打点`);
  },
});

/* eslint-disable no-new */
new Vue({
  router,
  store,
  el: '#app',
  template: '<App/>',
  components: { App },
});
