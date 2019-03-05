<template>
  <div class="index">
    <header>
      <h1>{{ indexMsg.title }}</h1>
      <h3>{{ indexMsg.subtitle }} </h3>
    </header>
    <section>
      <p>{{ $tc('login.tips', 1, {minute: 30, second: 29}) }}</p>
      <p>{{ $tc('login.tips', 2, {hour: 1}) }}</p>
      <hr>
      <p>
        <ul>
          <li>{{ $t(`order.status[${orderStatus}]`) }}</li>
        </ul>
      </p>
    </section>
  </div>
</template>
<script>
export default {
  name: 'Index',
  data() {
    return {
      orderStatus: 3,
    };
  },
  computed: {
    indexMsg() {
      return this.$t('index.header');
    },
  },
};
</script>
