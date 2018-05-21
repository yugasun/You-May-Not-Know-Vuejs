<template>
  <div class="comp1">
    <h1>Component 1</h1>
    <input type="text" v-model="msg" @change="handleChange">
  </div>
</template>
<script>
export default {
  name: 'comp1',
  data() {
    return {
      msg: this.$bus.msg,
    };
  },
  methods: {
    handleChange(e) {
      const newVal = e.target.value;
      this.$bus.$emit('msg-change', { value: newVal });
    },
  },
  created() {
    this.$bus.$on('msg-change', (payload) => {
      this.msg = payload.value;
    });
  },
};
</script>

