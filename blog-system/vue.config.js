const path = require('path')

const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
const CompressionWebpackPlugin = require('compression-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      return {
        resolve: {
          extensions: ['.js', '.vue', '.json', '.less'],
          alias: {
            vue$: 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            components: resolve('src/components'),
            pages: resolve('src/pages'),
            styles: resolve('src/assets/styles'),
            js: resolve('src/assets/js'),
            static: resolve('static'),
            jquery: 'jquery'
          }
        },
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
