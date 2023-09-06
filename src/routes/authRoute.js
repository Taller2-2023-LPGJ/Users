const { Router } = require('express');
const router = Router();

const {
    signUp,
    signIn
} = require('../controllers/authController');

router.get('/', signUp);
router.post('/', signIn);

module.exports = router;
