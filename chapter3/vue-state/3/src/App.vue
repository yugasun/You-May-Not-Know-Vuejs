<template>
  <div class="app">
    <comp1></comp1>
    <comp2></comp2>
  </div>
</template>
<script>
import comp1 from './components/comp1';
import comp2 from './components/comp2';

export default {
  name: 'App',
  components: {
    comp1,
    comp2,
  },
};
</script>
