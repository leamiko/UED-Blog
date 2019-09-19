module.exports = {
  dev: {
    NODE_ENV: 'development',
    WX_APP_ID: 'wx742cbf40cfbc1dbf',
    WX_APP_SECRET: '6e72bea53fd86a3c0dd13d067b425783',
    BASE_URL: 'http://127.0.0.1:3002',
    DB_URL: 'mongodb://localhost:27017/blog'
  },
  prod: {
    NODE_ENV: 'production',
    WX_APP_ID: 'wx742cbf40cfbc1dbf',
    WX_APP_SECRET: '6e72bea53fd86a3c0dd13d067b425783',
    BASE_URL: 'http://ued.lunz.cn',
    DB_URL: 'mongodb://blog:blog@localhost:27017/blog'
  }
}
