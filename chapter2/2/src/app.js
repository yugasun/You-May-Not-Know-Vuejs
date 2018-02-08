import Vue from 'vue';
import hello1 from './hello1.vue';
import hello2 from './hello2.vue';

new Vue({
  el: "#app",
  template: '<div><hello1/><hello2/></div>',
  components: {
    hello1,
    hello2
  }
});
