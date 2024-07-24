const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

router.post('/login', userController.login);
router.post('/logout', checkAuth, userController.logout);
router.post('/register', userController.register);
router.get('/confirm', userController.confirm);
router.get('/confirm-token-verify', userController.confirmVerifyToken);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.get('/reset-password-token-verify', userController.resetPasswordVerifyToken);
router.post('/users', checkAuth, checkRole({ roles: ['ROLE_ADMIN'] }), userController.createUser);
router.get('/users', checkAuth, checkRole({ roles: ['ROLE_ADMIN'] }), userController.readUsers);
router.put('/users/:id', checkAuth, checkRole({ roles: ['ROLE_USER', 'ROLE_ADMIN'] }), userController.updateUser);
router.delete('/users/:id', checkAuth, checkRole({ roles: ['ROLE_USER', 'ROLE_ADMIN'] }), userController.deleteUser);
router.get('/me', checkAuth, userController.me);

module.exports = router;
