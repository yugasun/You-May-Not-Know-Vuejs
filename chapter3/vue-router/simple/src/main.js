// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';

const routes = {
  '/': 'Home',
  '/hello': 'HelloWorld',
};

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
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
