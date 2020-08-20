module.exports = (router) => {

    const {SignUp, SignIn} = require('../validations/userSchema');
    const Validator = require('../middlewares/validator');
    const { SignUpController, SignInController } = require('../controllers/auth');
    
    router.post("/register", Validator(SignUp), SignUpController);
    router.post("/login", Validator(SignIn), SignInController);

    return router;
};


