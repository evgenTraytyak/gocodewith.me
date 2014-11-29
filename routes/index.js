var router = require('express').Router()
  , fs = require('fs')
  , path = require('path')
  , Room = require('../models/room')
  , colors = require('colors')

module.exports = function (passport) {
  router.use(isAuthenticated)

  router.get('/', function (req, res) {
    res.render('index',
      { user: req.user
      , room: req.room
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

  router.get('/themes', function (req, res) {
    var filePath = path.resolve(__dirname, '..', 'public/themes/', 'themes.json')
    fs.readFile(filePath, 'utf8', function (err, file) {
      res.json(file)
    })
  })

  router.get('/theme', function (req, res) {
    var filePath = path.resolve(__dirname, '..', 'public/themes/', req.query.name)
    fs.readFile(filePath, 'utf8', function (err, file) {
      res.send(file)
    })
  })

  router.post('/signup', passport.authenticate('signup',
    { successRedirect: '/'
    , failureRedirect: '/signup'
    , failureFlash: 'failure flash'
    }))

  router.get('/room/create', function (req, res) {

    var room = new Room(
    { 'name': req.query.name
    , 'creator_id': req.user
    , 'user_ids': [req.user._id]
    })

    console.log('')
    room.save()

    res.send('Room ' + req.query.name + ' created')

  })

  router.get('/room/:name', function (req, res) {
    findRoom(req, res)
  })

  router.use(function(req, res, next){
    res.status(404)
    console.log('Not found URL: %s'.red, req.url)
    res.send({ error: 'Not found' })
    return
  })

  router.use(function(err, req, res, next){
    res.status(err.status || 500)
    console.log('Internal error(%d): %s'.red, res.statusCode, err.message)
    res.send({ error: err.message })
    return
  })


  return router
}

//var roomExists = function (req, res, next) {
//  Room.findOne({ name: req.query.name }, function (err, room) {
//    if (err) return console.error(err)
//
//    if (!room) {
//      return next()
//    } else {
//      console.log('Room already exists')
//    }
//  }
//  }


var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated() || req.url == '/signin' || req.url == '/signup') {
    return next()
  }
  res.redirect('/signin')
}

var findRoom = function (req, res) {
  Room.findOne({'name': req.params.name}, function (err, room) {
    if (!room) {
      res.status(404).send('Room not found')
    } else {
      res.send(room.name)

      var callback = addUserToRoom
      userExistInRoom(req, room, callback)
    }
  })
}

var userExistInRoom = function (req, room, callback) {
  Room.findOne({name: room.name}).populate('user_ids').exec(function (err, foundRoom) {
    var i = 0
      , length = foundRoom.user_ids.length
      , needAdd = false

    for (; i < length; i++) {
      var user = foundRoom.user_ids[i]

      if (user.username == req.user.username) {
        console.log('User'.red, user.username.yellow.bold ,'already exists in the room'.red)
        needAdd = false
        break
      } else {
        needAdd = true
      }
    }
    if (needAdd) {
      callback(req, room)
    }


  })
}

var addUserToRoom = function (req, room) {
  var query = { name: room.name }
    , options = { $push: { user_ids: req.user._id } }

  Room.findOneAndUpdate(query, options, function (err, room) {
    if (err) { console.log(err) }

    if (!room) {
      //res.status(400)
      console.log('Room'.red, room.name.yellow.bold ,'not found'.red)
    } else {
      console.log('User'.green, req.user.username.yellow.bold ,'has been successfully added to the room'.green)
    }
  })
}

var removeUserFromRoom = function () {
  Room.findOneAndRemove(queryParams, options, function (err, room) {
    console.log('User is successfully remove from the room')
  })
}

var isRoomOwner = function (user, room) {
  return user.equals(room)
}
