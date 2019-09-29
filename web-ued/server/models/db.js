var mongoose = require('mongoose')
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
var DB_URL = 'mongodb://blog:blog@localhost:27017/blog' //线上
// var DB_URL = 'mongodb://localhost:27017/blog' //本地

var DB_URL = process.env.DB_URL

var blog = mongoose.createConnection(DB_URL, { useUnifiedTopology: true })

blog.on('connected', function() {
  console.log('Mongoose connection open to ' + DB_URL)
})

blog.on('error', function(err) {
  console.log('Mongoose connection error: ' + err)
})

blog.on('disconnected', function() {
  console.log('Mongoose connection disconnected')
})

module.exports = blog
