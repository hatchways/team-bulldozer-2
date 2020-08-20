const { body} = require('express-validator');
const PasswordMinLength = 6 ;

const UserSchema = {
    email : body('email').isEmail().normalizeEmail(),
    password: body('password').isLength({ min: PasswordMinLength }),
    firstName: body('firstName').isString(),
    lastName: body('lastName').isString()
}

module.exports.SignUp = [
    UserSchema.email,
    UserSchema.password,
    UserSchema.firstName,
    UserSchema.lastName
]

module.exports.SignIn = [
    UserSchema.email,
    UserSchema.password
]
