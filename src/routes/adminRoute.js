const middleware = require('../middleware/middleware');
const { Router } = require('express');
const router = Router();

const {
    signUp,
    signIn,
    blockUser,
    unlockUser,
    getAdmins
} = require('../controllers/adminController');

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/blockuser', middleware.userAdmin, blockUser);
router.post('/unlockuser', middleware.userAdmin, unlockUser);
router.get('/', middleware.userAdmin, getAdmins);

module.exports = router;