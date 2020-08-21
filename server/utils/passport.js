const { use } = require('passport');

module.exports = (app) => {

    const passport = require('passport');
    const LocalStratey = require('passport-local').Strategy;
    const User = require('../models/user');
    
    passport.use(new LocalStratey({ usernameField : 'email'},
        function(email, password, done) {
    
          User.findOne({ email: email }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
              return done(null, false, { message: 'Incorrect credentials .' });
            }
          user.validPassword(password, (err, isMatch) => {
              if (err || !isMatch) {
                return done(null, false, { message: 'Incorrect credentials.' });
              }
              return done(null, user);
            });
          });
        }
      ));
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id); 
    });
    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id,{
          password: false,
          salt: false,
          __v: false,
        }, function(err, user) {
            done(err, user);
        });
    });

    app.use(passport.initialize());
    app.use(passport.session());

    return app;
}
