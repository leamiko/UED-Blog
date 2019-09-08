import * as axios from 'axios'
import sha256 from 'crypto-js/sha256'
import Base64 from 'crypto-js/enc-base64'

// 加密算法，需安装crypto-js
function crypto (str) {
  const _sign = sha256(str)
  return encodeURIComponent(Base64.stringify(_sign))
}

const SECRET = process.env.SECRET

console.log(process.env.APIHOST)

const options = {
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
  timeout: 30000,
  baseURL: '/api'
}

// The server-side needs a full url to works
if (process.server) {
  options.baseURL = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}/api`
  options.withCredentials = true
}

const instance = axios.create(options)

// 对axios的每一个请求都做一个处理，携带上签名和timestamp
instance.interceptors.request.use(
  config => {
    const timestamp = new Date().getTime()
    const param = `timestamp=${timestamp}&secret=${SECRET}`
    const sign = crypto(param)
    config.params = Object.assign({}, config.params, { timestamp, sign })
    return config
  }
)

export default instance
