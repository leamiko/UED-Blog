// import axios from 'axios'
import * as VueCookie from 'vue-cookies'

export const state = () => ({
  authToken: null
})

export const mutations = {
  SET_TOKEN (state, data) {
    state.authToken = data
  }
}

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  nuxtServerInit ({ commit }, { req }) {
    // if (req.session && req.session.authToken) {
    //   commit('SET_TOKEN', req.session.authToken)
    // }
  },
  async login ({ commit }, data) {
    // try {
      // const { data } = await axios.post('/api/login', data)
      let DATA = JSON.stringify(data);
      // 设置cookie缓存，时限为 7200秒，即两个小时
      VueCookie.set('AUTHTOKEN', DATA, 7200);
      commit('SET_TOKEN', DATA)
    // } catch (error) {
    //   if (error.response && error.response.status === 401) {
    //     throw new Error('Bad credentials')
    //   }
    //   throw error
    // }
  },

  async logout ({ commit }) {
    // await axios.post('/api/logout')
    commit('SET_TOKEN', null)
  }

}
