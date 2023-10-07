const middleware = require('../middleware/middleware');
const { Router } = require('express');
const router = Router();

const {
    searchUser,
    getUsers
} = require('../controllers/userController');

router.get('/', getUsers);
router.get('/searchuser', searchUser);

module.exports = router;