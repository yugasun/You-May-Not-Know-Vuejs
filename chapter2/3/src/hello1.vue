<template>
  <div>
    <h1>{{ msg }}</h1>
    <a v-bind:href="info.site">{{ info.name }}</a><br>
    <a v-bind:href="user1.site">{{ user1.name }}</a><br>
    <a v-bind:href="user2.site">{{ user2.name }}</a><br>
  </div>
</template>
<script>
export default {
  name: 'hello1',
  data () {
    return {
      msg: 'Hello Vue.js',
      info: {},
      user1: {},
      user2: {}
    }
  },
  methods: {
    async getUserInfo () {
      try {
        const res = await this.$http.get('http://yapi.demo.qunar.com/mock/4377/userinfo');
        this.info = res.data
      } catch (e) {
        console.log(e);
      }
    },
    async get2UserInfo () {
      try {
        const res = await Promise.all([
          this.$http.get('http://yapi.demo.qunar.com/mock/4377/userinfo1'),
          this.$http.get('http://yapi.demo.qunar.com/mock/4377/userinfo2'),
        ])
        this.user1 = res[0].data;
        this.user2 = res[1].data;
      } catch (e) {
        console.log(e);
      }
    }
  },
  created () {
    this.getUserInfo();
    this.get2UserInfo();
  }
}
</script>
<style lang="scss" scoped>
h1 {
  color: $green;
}
</style>
