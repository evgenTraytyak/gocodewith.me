var LocalStrategy = require('passport-local').Strategy
  , User = require('../models/user')
  , bcrypt = require('bcrypt')

module.exports = function (passport) {

  passport.use('signup', new LocalStrategy({
        passReqToCallback : true
      },
      function (req, username, password, done) {

        var findOrCreateUser = function () {

          User.findOne({ 'username': username }, function (err, user) {

            if (err) {
              console.log('Error in SignUp: ' + err);
              return done(err);
            }

            if (user) {
              console.log('User already exists with username: ' + username);
              return done(null, false, req.flash('message','User Already Exists'))
            } else {

              var newUser = new User();

              newUser.username = username;
              newUser.password = encryptPassword(password);
              newUser.email = req.param('email');

              newUser.save(function (err) {
                if (err) {
                  console.log('Error in Saving user: ' + err);
                  throw err;
                }
                console.log('User Registration successful');
                return done(null, newUser);
              })
            }
          })
        }

        process.nextTick(findOrCreateUser)
      })
  );

  // generates hash using bcrypt
  var encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
  }
}
