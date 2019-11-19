var OSS = require('ali-oss')
export function client () {
  var client = new OSS({
    // endpoint: 'https://oss-cn-qingdao.aliyuncs.com',
    // accessKeyId: 'LTAI4FiiKzs2xTMQvXxchYnx',
    // accessKeySecret: '22C7QR5u5PefAGdSTqQMaJnMLCGx6D',
    // bucket: 'ued-okr',
    // accessUrl: '//ued-okr.oss-cn-qingdao.aliyuncs.com/'
    endpoint: 'https://oss-cn-hangzhou.aliyuncs.com',
    accessKeyId: 'LTAI7ZSVXWUMe0EV',
    accessKeySecret: 't3dl5VuzjuzN8IoPXCyNxemTK2hCPY',
    bucket: 'cheyinghz',
    accessUrl: '//cheyinghz.lunz.cn/'
  })
  return client
}
