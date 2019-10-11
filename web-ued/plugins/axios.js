import * as axios from 'axios'
import * as CryptoJS from 'crypto-js'
// 获取密钥/偏移量
const KEY = CryptoJS.enc.Utf8.parse(process.env.SECRET_KEY)
const IV = CryptoJS.enc.Utf8.parse(process.env.KEY_OFFSET)
// 加密算法
function Encrypt(word) {
  let srcs = CryptoJS.enc.Utf8.parse(word)
  let encrypted = CryptoJS.AES.encrypt(srcs, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.ciphertext.toString().toUpperCase()
}
// 解密算法
function Decrypt(word) {
  let encryptedHexStr = CryptoJS.enc.Hex.parse(word)
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  let decrypt = CryptoJS.AES.decrypt(srcs, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}

const SECRET = process.env.SECRET

const options = {
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
  timeout: 30000,
  baseURL: '/api'
}

// The server-side needs a full url to works
if (process.server) {
  options.baseURL = `http://${process.env.HOST || 'localhost'}:${process.env
    .PORT || 3000}/api`
  options.withCredentials = true
}

const instance = axios.create(options)

// 对axios的每一个请求都做一个处理，携带上签名和timestamp
instance.interceptors.request.use(config => {
  const timestamp = new Date().getTime()
  const param = `timestamp=${timestamp}&secret=${SECRET}`
  const sign = Encrypt(param)
  config.params = Object.assign({}, config.params, { timestamp, sign })
  return config
})

export default instance
