const sha256 = require('crypto-js/sha256')
const Base64 = require('crypto-js/enc-base64')

function crypto (str) {
  const _sign = sha256(str)
  return encodeURIComponent(Base64.stringify(_sign))
}
// 使用和客户端相同的一个秘钥
const SECRET = process.env.SECRET

function verifyMiddleware (req, res, next) {
  const { sign, timestamp } = req.query
  // 加密算法与请求时的一致
  const _sign = crypto(`timestamp=${timestamp}&secret=${SECRET}`)
  if (_sign === sign) {
    next()
  } else {
    res.status(401).send({
      message: 'invalid token'
    })
  }
}

module.exports = { verifyMiddleware }
