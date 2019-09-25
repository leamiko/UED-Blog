import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginForm: {}
  },
  mutations: {
    editLoginForm (state, form) {
      state.loginForm = form
    }
  },
  actions: {
    editLoginForm (context, form) {
      context.commit('editLoginForm', form)
    }
  }
})
