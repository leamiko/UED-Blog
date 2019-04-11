import Vue from 'vue'
import App from './App.vue'
import axios from 'axios' //引入axios
import router from './router'
import store from './store'
// 全局引入antd
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
// 引入全局的样式
import './assets/scss/common.scss'
import './assets/scss/website.scss'

Vue.use(Antd)

Vue.config.productionTip = false

axios.defaults.timeout = 5000;// 在超时前，所有请求都会等待 5 秒
axios.defaults.headers.post['Content-Type']= 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.baseURL = 'http://localhost:3000';// 配置接口地址
axios.defaults.withCredentials = false;


Vue.prototype.$ajax=axios // 在vue的原型上增加方法

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
