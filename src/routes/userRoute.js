const middleware = require('../middleware/middleware');
const { Router } = require('express');
const router = Router();

const {
    searchUser,
    getUsers,
    askForVerification
} = require('../controllers/userController');

router.get('/', getUsers);
router.post('/askforverification', askForVerification);
router.get('/searchuser', searchUser);

module.exports = router;