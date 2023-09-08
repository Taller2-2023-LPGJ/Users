const { Router } = require('express');
const router = Router();

const {
    refreshToken,
} = require('../controllers/tokenController');

router.post('/', refreshToken);

module.exports = router;
