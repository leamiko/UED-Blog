import axios from 'axios'
import { notification } from 'ant-design-vue'

axios.interceptors.request.use(function (config) {
  return config
}, function (error) {
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if (response.data.status_code !== 200) {
    notification.error({
      placement: 'bottomRight',
      description: response.data.message
    })
  }
  return response
}, function (error) {
  return Promise.reject(error)
})

function checkStatus (response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    return response.data
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: '网络异常'
  }
}

function checkCode (res) {
  // 404
  if (res.status === -404) {
    console.log(res.msg)
  }
  // 后端异常根据情况添加

  return res
}

export default {
  post (url, data) {
    // let encryptData = jse.encrypt(data);
    return axios({
      method: 'post',
      url,
      withCredentials: true,
      data: data,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  get (url, params) {
    return axios({
      method: 'get',
      url,
      params, // get 请求时带的参数
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  }
}
