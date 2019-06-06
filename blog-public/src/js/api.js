// 在html中应使用带有module类型的script。
// 示例:
// <script type="module" src="./api.js"></script>
// 或
// <script type="module">
// import { axiosGet, axiosPost, name } from '../src/js/api.js'
// </script>
// 在http服务器上访问，否则将会有一个CORS保护报错。
//
// 需在该引用前引用axios

const baseUrl = 'http://ued.lunz.cn/api' // 正式
// const baseUrl = 'http://localhost:3000/' // 本地

// 参数过滤
function filterNull(o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
  }
  if (toType(o[key]) === 'string') {
    o[key] = o[key].trim()
  } else if (toType(o[key]) === 'object') {
    o[key] = filterNull(o[key])
  } else if (toType(o[key]) === 'array') {
    o[key] = filterNull(o[key])
  }
  return o
}

// 自定义判断元素类型JS
function toType(obj) {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase()
}

function handleAxios(method, url, params, success, failure) {
  if (params) {
    params = filterNull(params)
  }
  axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    withCredentials: false,
    baseURL: baseUrl
  })
    .then(function(res) {
      if (success) {
        success(res.data)
      } else {
        failure(res.data)
      }
    })
    .catch(function(err) {
      console.error(err)
    })
}

const axiosGet = function(url, params, success, failure) {
  return handleAxios('GET', url, params, success, failure)
}
const axiosPost = function(url, params, success, failure) {
  return handleAxios('POST', url, params, success, failure)
}

export { axiosGet, axiosPost }
