<template>
  <div class="comp3">
    <label>
      {{ $attrs.label }}
      <input
        v-bind="$attrs"
        @input="$emit('input', $event.target.value)"
      />
    </label>
  </div>
</template>
<script>
export default {
  name: 'comp3',
};
</script>

