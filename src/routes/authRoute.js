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
    blocked
} = require('../controllers/authController');

router.post('/signup',signUp);
router.post('/signupconfirm', signUpConfirm);
router.post('/signin', signIn);
router.post('/signupgoogle', signUpGoogle);
router.post('/signingoogle', signInGoogle);
router.post('/setPassword', setPassword);
router.post('/recoverPassword', recoverPassword);
router.post('/verifyCodeRecoverPassword', verifyCodeRecoverPassword);
router.get('/blocked', blocked);

module.exports = router;
