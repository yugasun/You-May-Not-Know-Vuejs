<template>
  <div class="comp2">
    <h1>Component 2</h1>
    <input type="text" v-model="state.msg">
  </div>
</template>
<script>
import state from '../state';

export default {
  name: 'comp2',
  mixins: [state],
  data() {
    return {};
  },
};
</script>

