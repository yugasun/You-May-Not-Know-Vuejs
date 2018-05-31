<template>
  <div class="comp1">
    <h1>Component 1</h1>
    <input type="text" v-model="msg">
    <input type="text" v-model="username">
  </div>
</template>
<script>
export default {
  name: 'comp1',
  data() {
    return {
      username: 'yugasun',
    };
  },
  computed: {
    msg: {
      get() {
        return this.$store.state.msg;
      },
      set(val) {
        this.$store.dispatch('UPDATE_MSG', { msg: val });
      },
    },
  },
  watch: {
    username: {
      immediate: true,
      handler: 'getUserInfo',
    },
  },
  methods: {
    getUserInfo() {
      const info = {
        username: 'yugasun',
        site: 'yugasun.com',
      };
      /* eslint-disable no-console */
      console.log(info);
    },
  },
};
</script>

