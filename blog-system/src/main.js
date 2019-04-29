import Vue from 'vue'
import App from './App.vue'
import axios from 'axios' // 引入axios
import router from './router'
import store from './store'
import http from './utils/http'
import api from './utils/api'
import config from './utils/config'
import localEvent from './utils/local'
// 全局引入antd
import Antd from 'ant-design-vue'
import VueQuillEditor from 'vue-quill-editor'
import 'ant-design-vue/dist/antd.css'
// 引入全局的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import './assets/scss/common.scss'
import './assets/scss/website.scss'

import moment from 'moment';

Vue.use(Antd)
Vue.use(VueQuillEditor)
Vue.filter('formatDateDay', (time) => {
  return moment(time).format('YYYY-MM-DD')
})

Vue.prototype.$http = http
Vue.prototype.api = api
Vue.prototype.config = config
Vue.prototype.localEvent = localEvent

Vue.config.productionTip = false

axios.defaults.timeout = 5000// 在超时前，所有请求都会等待 5 秒
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.baseURL = 'http://localhost:3000'// 配置接口地址
axios.defaults.withCredentials = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
