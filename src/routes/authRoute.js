const { Router } = require('express');
const router = Router();

const {
    signUp,
    signIn,
    setPassword,
    recoverPassword,
    verifyCodeRecoverPassword
} = require('../controllers/authController');

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/setPassword', setPassword);
router.post('/recoverPassword', recoverPassword);
router.post('/verifyCodeRecoverPassword', verifyCodeRecoverPassword);

module.exports = router;
