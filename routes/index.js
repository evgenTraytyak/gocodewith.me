var router = require('express').Router()

module.exports = function (passport) {
  router.use(isAuthenticated)

  router.get('/', function (req, res) {
    res.render('dashboard',
      { user: req.user
      , message: req.flash('message')
      })
  })

  router.get('/logout', function (req, res) {
    req.logout()
    res.redirect('/')
  })

  router.get('/signin', function (req, res) {
    var flashText = req.flash('message')
      , obj = flashText.length ? { message: flashText } : {}
    res.render('signin', obj)
  })

  router.post('/signin', passport.authenticate('signin',
    { successRedirect: '/'
    , failureRedirect: '/signin'
  }))

  router.get('/signup', function (req, res) {
    res.render('signup', { message: req.flash('message') })
  })

  router.get('/auth/github', passport.authenticate('github'),
    function (req, res) { }
  )

  router.get('/auth/github/callback', passport.authenticate('github',
    { failureRedirect: '/signin'
    }),
    function (req, res) { res.redirect('/') }
  )

  router.get('/theme', function (req, res) {
    var filePath = path.join(dir_root, 'public/themes/', req.query.name + '.css')
    fs.readFile(filePath, 'utf8', function (err, file) {
      res.send(file)
    })
  })

  router.get('/languages', function (req, res) {
    var filePath = path.join(dir_root, 'public/codelanguages/', 'languages.json')
    fs.readFile(filePath, 'utf8', function (err, file) {
      res.json(file)
    })
  })

  router.get('/language', function (req, res) {
    var syntaxMode = req.query.name
      , filePath = path.join(dir_root, 'public/codelanguages', syntaxMode, syntaxMode + '.js')

    fs.readFile(filePath, 'utf8', function (err, file) {
      if (err) console.error(err)

      res.send(file)
    })
  })

  router.post('/signup', passport.authenticate('signup',
    { successRedirect: '/'
    , failureRedirect: '/signup'
    , failureFlash: 'failure flash'
    }))

  router.post('/room/create', RoomsController.create)

  router.get('/room/:name', RoomsController.show)

  router.post('/room', function(req, res) {
    res.redirect('/room/' + req.body.name)
  })

  router.get('/fonts', function (req, res) {
    var filePath = path.join(dir_root, 'public/fonts', 'fonts.json')
    fs.readFile(filePath, 'utf8', function (err, file) {
      res.json(file)
    })
  })

  router.get('/font', function (req, res) {
    var filePath = path.join(dir_root, 'public/fonts', req.query.name + '.ttf')
      , sendingPath = path.join('/fonts', req.query.name + '.ttf')

    fs.readFile(filePath, 'utf8', function (err, file) {
      res.send(sendingPath)
    })
  })

  router.get('/settings/room/', RoomsController.defaultSettings)
  router.post('/settings/room/syntax', RoomsController.saveSyntax)

  router.get('/settings/user/', UsersController.defaultSettings)

  router.post('/settings/user/font', UsersController.saveFont)
  router.post('/settings/user/font-size', UsersController.saveFontSize)
  router.post('/settings/user/theme', UsersController.saveTheme)


  // router.get(/^\/room\/\?name=()/, function(req, res) {

  // })

  // router.use(function(req, res, next){
  //   res.status(404)
  //   console.log('Not found URL: %s'.red, req.url)
  //   res.send({ error: 'Not found' })
  //   return
  // })

  // router.use(function(err, req, res, next){
  //   res.status(err.status || 500)
  //   console.log('Internal error (%d): %s'.red, res.statusCode, err.message)
  //   res.send({ error: err.message })
  //   return
  // })


  return router
}

var isAuthenticated = function (req, res, next) {
  var authUrls = new RegExp('^\\/(' + ['signin', 'signup', 'auth'].join('|') + ')').test(req.url)
    , isAuthenticated = req.isAuthenticated();

  if ((authUrls && !isAuthenticated) || (!authUrls && isAuthenticated)) {
    next()
  }
  else if (isAuthenticated) {
    res.redirect('/')
  }
  else {
    res.redirect('/signin')
  }
}


var removeUserFromRoom = function () {
  Room.findOneAndRemove(queryParams, options, function (err, room) {
    console.log('User is successfully remove from the room')
  })
}

var isRoomOwner = function (user, room) {
  return user.equals(room)
}
