import Vue from 'vue';
import VueRouter from 'vue-router';

import Index from '@/views/index';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Index,
  },
  {
    path: '/:id',
    component: Index,
  },
];

export default new VueRouter({
  routes,
});

