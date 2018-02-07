var Vue = require('vue')

new Vue({
  el: "#app",
  template: "<h1>{{ msg }}</h1>",
  data () {
    return {
      msg: 'Hello Vue.js 222'
    }
  }
})
