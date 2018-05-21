<template>
  <div class="comp2">
    <h1>Component 2</h1>
    Change by object reference: <input type="text" v-model="$bus.msg"><br/>
    Change by event: <input type="text" v-model="msg" @change="handleChange">
  </div>
</template>
<script>
export default {
  name: 'comp2',
  data() {
    return {
      msg: this.$bus.msg,
    };
  },
  methods: {
    handleChange(e) {
      console.log(e);
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

