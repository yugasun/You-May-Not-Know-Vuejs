<template>
  <div class="comp2">
    <h1>Component 2</h1>
    <input type="text" v-model="msg">
  </div>
</template>
<script>
import logMixin from '@/mixins/log';

export default {
  name: 'comp2',
  mixins: [logMixin],
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

