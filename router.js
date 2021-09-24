const router = require('express').Router();
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');
const {route} = require("express/lib/router");
router.get('/', userController.homePage);

// User realted routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

// Post related routes
router.get('/create-post', userController.mustBeLoggedIn, postController.createPostPage);
router.post('/create-post', userController.mustBeLoggedIn, postController.create);
router.post('/post/:id/delete', userController.mustBeLoggedIn, postController.delete);
router.get('/post/:id', userController.mustBeLoggedIn, postController.viewSingle);
module.exports = router;