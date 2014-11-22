var router = require('express').Router()

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

  router.post('/signup', passport.authenticate('signup',
    { successRedirect: '/'
    , failureRedirect: '/signup'
    , failureFlash : true
    }))

  return router
}
