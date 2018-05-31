<template>
  <div class="index">
    <router-link :to="{path: '/1'}">挑战到第二页</router-link><br/>
    <router-link v-if="$route.path === '/1'" :to="{path: '/'}">返回</router-link>
    <comp1 ></comp1>
    <comp2></comp2>
    <h3>{{ username }} </h3>

    <comp3
      :value="value"
      label="用户名"
      id="username"
      placeholder="请输入用户名"
      @input="handleInput"
    />
  </div>
</template>
<script>
import comp1 from '@/components/comp1';
import comp2 from '@/components/comp2';
import comp3 from '@/components/comp3';

export default {
  name: 'Index',
  data() {
    return {
      username: 'Loading...',
      value: 'yuga',
    };
  },
  components: {
    comp1,
    comp2,
    comp3,
  },
  methods: {
    handleInput(val) {
      this.value = val;
    },
    getName() {
      const id = this.$route.params.id;
      // 模拟请求
      setTimeout(() => {
        if (id) {
          this.username = 'Yuga Sun';
        } else {
          this.username = 'yugasun';
        }
      }, 300);
    },
  },
  created() {
    this.getName();
  },
};
</script>
