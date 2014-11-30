var router = require('express').Router()

module.exports = function (passport) {
  router.use(isAuthenticated)

  router.get('/', function (req, res) {
    res.render('dashboard',
      { user: req.user
      , message: req.flash('message')
      })
  })

  router.get('/signin', function (req, res) {
    var flashText = req.flash('message')
      , obj = flashText.length ? { message: flashText } : {}
    res.render('signin', obj)
  })

  router.post('/signin', passport.authenticate('signin',
    { successRedirect: '/'
    , failureRedirect: '/signin'
    , failureFlash : 'failure signin'
  }))

  router.get('/signup', function (req, res) {
    res.render('signup', { message: req.flash('message') })
  })

  router.get('/auth/github', passport.authenticate('github'),
    function (req, res) {

    }
  )

  router.get('/auth/github/callback', passport.authenticate('github',
    { failureRedirect: '/signin'
    }),
    function (req, res) {
     res.redirect('/')
    }
  )

  router.get('/themes', function (req, res) {
    var filePath = path.join(dir_root, 'public/themes/', 'themes.json')
    fs.readFile(filePath, 'utf8', function (err, file) {
      res.json(file)
    })
  })

  router.get('/theme', function (req, res) {
    var filePath = path.join(dir_root, 'public/themes/', req.query.name)
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
  if (req.isAuthenticated() || req.url == '/signin' || req.url == '/signup' || /^\/auth/.test(req.url)) {
    return next()
  }
  res.redirect('/signin')
}


var removeUserFromRoom = function () {
  Room.findOneAndRemove(queryParams, options, function (err, room) {
    console.log('User is successfully remove from the room')
  })
}

var isRoomOwner = function (user, room) {
  return user.equals(room)
}
