import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const types = {
  UPDATE_MSG: 'UPDATE_MSG',
};

const mutations = {
  [types.UPDATE_MSG](state, payload) {
    state.msg = payload.msg;
  },
};

const actions = {
  [types.UPDATE_MSG]({ commit }, payload) {
    commit(types.UPDATE_MSG, payload);
  },
};

export default new Vuex.Store({
  state: {
    msg: 'Hello world',
  },
  mutations,
  actions,
});
