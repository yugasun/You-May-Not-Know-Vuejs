import Vue from 'vue';
import VueI18n from 'vue-i18n';

import indexMsg from './modules/index';
import loginMsg from './modules/login';
import orderMsg from './modules/order';

Vue.use(VueI18n);

const messages = {
  zh: {
    ...indexMsg.zh,
    ...loginMsg.zh,
    ...orderMsg.zh,
  },
  en: {
    ...indexMsg.en,
    ...loginMsg.en,
    ...orderMsg.en,
  },
};

const i18n = new VueI18n({
  locale: 'zh',
  messages,
});

export default i18n;
