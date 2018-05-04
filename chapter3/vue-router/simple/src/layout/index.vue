<template>
  <div class="container">
    <ul>
      <li><a :class="{active: $root.currentRoute === '/'}" href="/">Home</a></li>
      <li><a :class="{active: $root.currentRoute === '/hello'}" href="/hello">HelloWord</a></li>
    </ul>

    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'Layout',
};
</script>
<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 15px 30px;
  background: #f9f7f5;
}
a.active {
  color: #42b983;
}
</style>
