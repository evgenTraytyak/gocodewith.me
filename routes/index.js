var router = require('express').Router()
  , fs = require('fs')
  , path = require('path')

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/signin')
}

module.exports = function (passport) {
  router.get('/', isAuthenticated, function (req, res) {
    res.render('index', { user: req.user })
  })

  router.get('/signin', function (req, res) {
    res.render('signin')
  })

  router.post('/signin', passport.authenticate('signin',
    { successRedirect: '/'
    , failureRedirect: '/signin'
    , failureFlash : true
  }))

  router.get('/signup', function (req, res) {
    res.render('signup')
  })

  router.get('/themes', function (req, res) {
    var filePath = path.resolve(__dirname, '..', 'public/themes/', 'themes.json')
    fs.readFile(filePath, 'utf8', function (err, file) {
      res.send(file)
    });
  })

  router.get('/theme', function (req, res) {
    var filePath = path.resolve(__dirname, '..', 'public/themes/', req.query.name)
    fs.readFile(filePath, 'utf8', function (err, file) {
      console.log(JSON.stringify(file))
      res.send(file)
    });
  })

  router.post('/signup', passport.authenticate('signup',
    { successRedirect: '/'
    , failureRedirect: '/signup'
    , failureFlash : true
    }))

  return router
}
