<template>
  <div class="comp1">
    <h1>Component 1</h1>
    <input type="text" v-model="state.msg">
  </div>
</template>
<script>
import state from '../state';

export default {
  mixins: [state],
  name: 'comp1',
  data() {
    return {};
  },
};
</script>

