const express = require('express');

const router = express.Router();
const { SignUp, SignIn } = require('../validations/userSchema');
const Validator = require('../middlewares/validator');
const IsLoggedIn = require('../middlewares/isLoggedIn');
const {
  SignUpController,
  SignInController,
  GetCurrentUserController,
  Logout,
} = require('../controllers/auth');

router.post('/register', Validator(SignUp), SignUpController);
router.post('/login', Validator(SignIn), SignInController);
router.get('/me', IsLoggedIn(), GetCurrentUserController);
router.get('/logout', IsLoggedIn(), Logout);

module.exports = router;
