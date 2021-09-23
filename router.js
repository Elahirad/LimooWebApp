const router = require('express').Router();
const userController = require('./controllers/userController');
router.get('/', userController.homePage);

module.exports = router;