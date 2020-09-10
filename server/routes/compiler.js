const express = require('express');

const router = express.Router();
// const { SignUp, SignIn } = require('../validations/userSchema');
// const Validator = require('../middlewares/validator');
const IsLoggedIn = require('../middlewares/isLoggedIn');
const { Compile } = require('../controllers/compiler');

router.post('/', IsLoggedIn(), Compile);

module.exports = router;
