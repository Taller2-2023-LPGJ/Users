const { Router } = require('express');
const router = Router();

const {
    signUp,
    signIn,
    blockUser,
    unlockUser,
    getAdmins,
    verifyUser
} = require('../controllers/adminController');

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/blockuser', blockUser);
router.post('/unlockuser', unlockUser);
router.post('/verifyuser', verifyUser);
router.get('/', getAdmins);

module.exports = router;