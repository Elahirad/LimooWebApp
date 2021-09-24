const router = require('express').Router();
const userController = require('./controllers/userController');
router.get('/', userController.homePage);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
module.exports = router;