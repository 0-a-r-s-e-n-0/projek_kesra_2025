const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');
const { adminAuth } = require('../Middlewares/userAuth')
// const { validateAdminLogin } = require('../Middlewares/validations/validate');

// router.post('/login', validateAdminLogin, adminController.login);

router.get('/users', adminAuth, adminController.getAllUsers);
router.patch('/:userId/verify', adminAuth, adminController.verifyUser);
router.patch('/users/:userId/suspend', adminAuth, adminController.toggleUserSuspend);

// router.post('/register', validateAdminRegister, adminController.register); // opsional, bisa manual insert

module.exports = router;
