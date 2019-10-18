var OSS = require('ali-oss')
export function client () {
  var client = new OSS({
    endpoint: 'https://oss-cn-qingdao.aliyuncs.com',
    accessKeyId: 'LTAI4FiiKzs2xTMQvXxchYnx',
    accessKeySecret: '22C7QR5u5PefAGdSTqQMaJnMLCGx6D',
    bucket: 'ued-okr',
    accessUrl: '//ued-okr.oss-cn-qingdao.aliyuncs.com/'
  })
  return client
}
