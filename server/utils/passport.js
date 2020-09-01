const passport = require('passport');
const LocalStratey = require('passport-local').Strategy;
const User = require('../models/user').UserModel;

module.exports = (app) => {
  passport.use(
    new LocalStratey({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({ email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: 'Incorrect credentials .' });
        }
        user.validPassword(password, (error, isMatch) => {
          if (error || !isMatch) {
            return done(null, false, { message: 'Incorrect credentials.' });
          }
          return done(null, user);
        });
      });
    }),
  );
  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(
      id,
      {
        password: false,
        salt: false,
        __v: false,
      },
      (err, user) => {
        done(err, user);
      },
    );
  });

  app.use(passport.initialize());
  app.use(passport.session());

  return app;
};
