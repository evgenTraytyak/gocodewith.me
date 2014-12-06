var express = require('express')
  , app = express()
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , url = require('url')
  , httpLogger = require('morgan')
  , favicon = require('serve-favicon')

// Morgan logger
app.use(httpLogger('dev'))

// Connect to DB
var mongoose = require('mongoose')
  , dbConfig = require('../config/index.js').mongodb
  , db = mongoose.connection

mongoose.connect(process.env.MONGOLAB_URI || dbConfig.url)

db.on('error', function (err) {
  console.error('Database connection error:'.red, err.message);
})

db.once('open', function callback () {
  console.log('App successfully connected to DB'.green, dbConfig.url.yellow.bold);
})

// View engine setup
app.set('views', path.resolve(dir_root, 'views'))
app.set('view engine', 'jade')

app.use(favicon(dir_root + '/public/images/favicon.ico'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static(path.resolve(dir_root, 'public')))

// Configuring Passport
var passport = require('passport')
  , expressSession = require('express-session')

app.use(expressSession({secret: 'keyboard cat'}))

// Middleware for initialize passport in Express
app.use(passport.initialize())
app.use(passport.session())

// Initialize Passport
var initPassport = require('../passport/init')
initPassport(passport);

// Flash middleware
var flash = require('connect-flash');
app.use(flash());

// Add routing
var routes = require('../routes/index')(passport)
app.use('/', routes)


module.exports = {
  start: function (server) {
    app.listen(process.env.PORT || server.port, function (err) {
      if (err) return console.error(err)
      console.log('Http server running on port:'.green, colors.yellow.bold(server.port))
    })
  }
}
