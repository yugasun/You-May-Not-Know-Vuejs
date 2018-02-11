<template>
  <h1>{{ msg }}</h1>
</template>
<script>
export default {
  name: 'hello2',
  data () {
    return {
      msg: 'Hello Vue.js 单文件组件~'
    }
  }
}
</script>
<style lang="scss" scoped>
h1 {
  color: $red;
}
</style>


