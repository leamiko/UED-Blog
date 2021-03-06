import * as VueCookie from 'vue-cookies'
import * as CryptoJS from 'crypto-js'
// 获取密钥/偏移量
const KEY = CryptoJS.enc.Utf8.parse(process.env.SECRET_KEY)
const IV = CryptoJS.enc.Utf8.parse(process.env.KEY_OFFSET)
// cookie字符串 转换成对象
// function cookieparse(cookieOBJ) {
//   let cookieArr = cookieOBJ.split('; ')
//   let obj = {}
//   cookieArr.forEach(i => {
//     let arr = i.split('=')
//     obj[arr[0]] = arr[1]
//   })
//   return obj
// }

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

export const state = () => ({
  authToken: null,
  isLogin: true,
  modalVisible: false,
  qrcodeBindBox: false,
  wxUnionId: null,
  flag:null,
  redirect: null
})

export const mutations = {
  SET_TOKEN(state, data) {
    state.authToken = data
  },
  isLogin(state, data) {
    // console.log(data)
    state.isLogin = data
  },
  modalVisible(state, data) {
    state.modalVisible = data
  },
  qrcodeBindBox(state, data) {
    state.qrcodeBindBox = data
  },
  wxUnionId(state, data) {
    state.wxUnionId = data
  },
  flag(state, data){
    state.flag = data
  },
  ChangeRedirect(state, data) {
    state.redirect = data
  }
}

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  nuxtServerInit({
    commit
  }, {
    req
  }) {
    if (req.session.user) {
      commit('SET_TOKEN', Encrypt(req.session.user.account))
    }
  },
  async login({
    commit
  }, data) {
    // 设置cookie缓存，时限为 30d
    VueCookie.set('AUTHTOKEN', Encrypt(data.account), 60 * 60 * 24 * 30)
    commit('SET_TOKEN', Encrypt(data.account))
  },

  async logout({
    commit
  }) {
    commit('SET_TOKEN', null)
  },
}
