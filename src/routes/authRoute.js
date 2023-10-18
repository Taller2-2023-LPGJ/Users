const middleware = require('../middleware/middleware');
const { Router } = require('express');
const router = Router();

const {
    signUp,
    signUpConfirm,
    signIn,
    signUpGoogle,
    signInGoogle,
    setPassword,
    recoverPassword,
    verifyCodeRecoverPassword,
    verifyAuth
} = require('../controllers/authController');

router.post('/signup',signUp);
router.post('/signupconfirm', signUpConfirm);
router.post('/signin', signIn);
router.post('/signupgoogle', signUpGoogle);
router.post('/signingoogle', signInGoogle);
router.post('/setPassword', setPassword);
router.post('/recoverPassword', recoverPassword);
router.post('/verifyCodeRecoverPassword', verifyCodeRecoverPassword);
router.post('/verifyauth', middleware.verifyAuth, verifyAuth);

module.exports = router;
