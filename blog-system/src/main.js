import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import http from './utils/http'
import api from './utils/api'
// 全局引入antd
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
// 引入全局的样式
import './assets/scss/common.scss'
import './assets/scss/website.scss'

Vue.use(Antd)

Vue.prototype.$http = http
Vue.prototype.api = api

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
