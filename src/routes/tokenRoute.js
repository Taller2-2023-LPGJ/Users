const { Router } = require('express');
const router = Router();

const {
    sessionToken,
} = require('../controllers/tokenController');

router.post('/', sessionToken);

module.exports = router;
