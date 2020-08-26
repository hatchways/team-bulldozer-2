const { SignUp, SignIn } = require('../validations/userSchema');
const Validator = require('../middlewares/validator');
const IsLoggedIn = require('../middlewares/isLoggedIn');
const {
  SignUpController,
  SignInController,
  GetCurrentUserController,
} = require('../controllers/auth');

module.exports = (router) => {
  router.post('/register', Validator(SignUp), SignUpController);
  router.post('/login', Validator(SignIn), SignInController);
  router.get('/me', IsLoggedIn(), GetCurrentUserController);
  //   router.get("/logout", IsLoggedIn(), GetCurrentUserController);

  return router;
};
