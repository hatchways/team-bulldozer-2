const { body} = require('express-validator');
const PasswordMinLength = 6 ;

const UserSchema = {
    email : body('email').isEmail().withMessage('Invalid email value').normalizeEmail(),
    password: body('password').isLength({ min: PasswordMinLength }),
    confirmPassword: body('confirmPassword')
        .isLength({ min: PasswordMinLength })
        .withMessage(`Password must contain at least ${PasswordMinLength} characters`)
        .custom((value, { req }) => {
            return req.body.password === value;
          })
          .withMessage("Passwords don't match."),
    firstName: body('firstName').isString()
        .notEmpty().withMessage( "FirstName is required"),
    lastName: body('lastName').isString()
        .notEmpty().withMessage( "LastName is required"),
}

module.exports.SignUp = [
    UserSchema.email,
    UserSchema.password,
    UserSchema.confirmPassword,
    UserSchema.firstName,
    UserSchema.lastName
]

module.exports.SignIn = [
    UserSchema.email,
    UserSchema.password
]
