const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
const CompressionWebpackPlugin = require('compression-webpack-plugin')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: productionGzipExtensions,
            threshold: 2048,
            minRatio: 0.8
          })
        ]
      }
    }
  }
}
