var LocalStrategy = require('passport-local').Strategy
  , User = require('../models/user')
  , bcrypt = require('bcrypt')

module.exports = function (passport) {

  passport.use('signin', new LocalStrategy({
        passReqToCallback : true
      },
      function (req, username, password, done) {

        User.findOne({ 'username' :  username },
          function (err, user) {

            if (err)
              return done(err);

            if (!user) {
              console.log('User Not Found with username ' + username);
            }

            if (!isValidPassword(user, password)) {
              console.log('Invalid Password');
              return done(null, false, req.flash('message', 'Invalid Password'));
            }

            return done(null, user);
          }
        );

      })
  );

  var isValidPassword = function (user, password) {
    return bcrypt.compareSync(password, user.password);
  }
}
