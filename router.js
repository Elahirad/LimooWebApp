const router = require('express').Router();
const userController = require('./controllers/userController');
router.get('/', userController.homePage);
router.post('/register', userController.register);
module.exports = router;