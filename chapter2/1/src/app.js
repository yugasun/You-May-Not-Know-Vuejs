require('./app.scss');

var Vue = require('vue');
var logoSrc =  require('./logo.jpg')

new Vue({
  el: "#app",
  data () {
    return {
      msg: 'Hello Vue.js'
    }
  },
  render (h) {
    return (
      h('div', [
        h('img', {
          domProps: {
            src: logoSrc,
            alt: 'logo',
            className: 'logo'
          }
        }),
        h('h1', this.msg)
      ])
    )
  }
});
