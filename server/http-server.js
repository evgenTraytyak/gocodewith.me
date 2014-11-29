var express = require('express')
  , app = express()
  , path = require('path')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , url = require('url')
  , httpLogger = require('morgan')
  , log = require('npmlog')
  , fs = require('fs')
  , colors = require('colors')

// Morgan logger
app.use(httpLogger('dev'))

// Connect to DB
var mongoose = require('mongoose')
  , dbConfig = require('./db')
  , db = mongoose.connection

mongoose.connect(dbConfig.url)

db.on('error', function (err) {
  console.error('Database connection error:'.red, err.message);
})

db.once('open', function callback () {
  console.log('App successfully connected to DB'.green, dbConfig.url.yellow.bold);
})

// View engine setup
app.set('views', path.resolve(__dirname, '..', 'views'))
app.set('view engine', 'jade')


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static(path.resolve(__dirname, '..', 'public')))

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
    app.listen(server.port, function (err) {
      if (err) return console.error(err)
      console.log('Http server running on port:'.green, colors.yellow.bold(server.port))
    })
  }
}
