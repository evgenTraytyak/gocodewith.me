var GithubStrategy = require('passport-github').Strategy
  , oauth = require(dir_root + '/oauth')

module.exports = function (passport) {
  passport.use(new GithubStrategy(
    { clientID: oauth.github.clientID
    , clientSecret: oauth.github.clientSecret
    , callbackURL: oauth.github.callbackURL
    , scope: 'user:email'
    },
    function (accessToken, refreshToken, profile, done) {
      User
        .findOne({ githubId: profile.id })
        .exec(function (err, user) {
          if (err) { console.log (err) }

          if (!err && user != null) {
            done(err, user)
          } else {
            var user = new User(
              { githubId: profile.id
              , username: profile.username
              , email: profile.emails[0].value
              }
            )

            user.save(function(err) {
              if (err) { console.log(err) }
              else {
                done(null, user)
              }
            })
          }
        })
    }
  ))
}
