<template>
  <div class="container">
    <ul>
      <li>
        <router-link href="#/">Home</router-link>
      </li>
      <li>
        <router-link href="#/hello">HelloWord</router-link>
      </li>
    </ul>
    <slot></slot>
  </div>
</template>
<script>
import RouterLink from '@/components/router-link';

export default {
  name: 'Layout',
  components: {
    RouterLink,
  },
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
