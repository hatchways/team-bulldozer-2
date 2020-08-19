const User = require('../models/user');
const HttpStatus = require('http-status-codes');
const passport = require('passport');

// register controller
exports.SignUpController = async (req, res, next) => {
    try {
        const { email, password , firstName, lastName } = req.body;
        const userExists = await User.exists({ email });
        if (userExists) {
            res.status(HttpStatus.CONFLICT).send({ response: `Email ${email} already used!` });
            return;
        }
        const user = new User({
            email, password, firstName, lastName
        });
        await user.save();
        //authenticate the user after the registration
        Authenticate(req, res, next, HttpStatus.CREATED)
    } catch (error) {
        next(error)
    }
}
//login controller
exports.SignInController = async (req, res, next) => {
    Authenticate(req, res, next, HttpStatus.OK)
}

function Authenticate(req, res, next, statusCode) {
    passport.authenticate('local', (err, user) => {
      if (err) { next(err); }
      if (!user) {
        return res.status(HttpStatus.FORBIDDEN).send(user);
      }
      req.logIn(user, async (loginErr) => {
        if (loginErr) { return next(loginErr); }
        const dbUser = await User.findOne({ _id: user._id }, {
          password: false,
          salt: false,
          __v: false,
        }).lean();
        return res.status(statusCode).send(dbUser);
      });
  
      return true;
    })(req, res, next);
  }
  