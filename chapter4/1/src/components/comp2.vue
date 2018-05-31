<template>
  <div class="comp2">
    <h1>Component 2</h1>
    <input type="text" v-model="msg">
  </div>
</template>
<script>
export default {
  name: 'comp2',
  data() {
    return {
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
};
</script>

