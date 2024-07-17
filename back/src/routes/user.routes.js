const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const checkAuth = require('../middlewares/checkAuth');

router.post('/login', userController.login);
router.post('/logout', checkAuth, userController.logout);
router.post('/register', userController.register);
router.get('/confirm', userController.confirm);
router.get('/confirm-token-verify', userController.confirmVerifyToken);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.get('/reset-password-token-verify', userController.resetPasswordVerifyToken);
router.post('/users', checkAuth, userController.createUser);
router.get('/users', checkAuth, userController.readUsers);
router.put('/users/:id', checkAuth, userController.updateUser);
router.put('/users/:userId', userController.updateProfile);
router.delete('/users/:id', checkAuth, userController.deleteUser);
router.delete('/users/:userId', userController.deleteAccount);
router.get('/me', checkAuth, userController.me);

module.exports = router;
