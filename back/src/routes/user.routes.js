const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authentification = require('../middlewares/authentification');

router.post('/login', userController.login);
router.post('/logout', authentification, userController.logout);
router.post('/register', userController.register);
router.get('/confirm', userController.confirm);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.get('/users', authentification, userController.getUsers);
router.post('/logout-all', authentification, userController.logoutAll);
router.get('/me', authentification, userController.me);

module.exports = router;
