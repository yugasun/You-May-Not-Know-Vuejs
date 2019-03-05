<template>
    <div class="app">
        <div class="lang-select-box">
            <select
                v-model="lang"
                class="lang-select"
            >
                <option value="zh">中文</option>
                <option value="en">English</option>
            </select>
        </div>
        <router-view></router-view>
    </div>
</template>
<script>
import i18n from './lang';

export default {
  name: 'App',
  data() {
    return {
      lang: 'zh',
    };
  },
  watch: {
    lang(val) {
      i18n.locale = val;
    },
  },
};
</script>
