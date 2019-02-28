<template>
  <div class="app">
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>
<script>
export default {
  name: 'App',
};
</script>
