const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');
const { adminAuth } = require('../Middlewares/userAuth')

router.get('/users', adminAuth, adminController.getAllUsers);
router.get('/:userId/detail', adminAuth, adminController.getUserById);
router.patch('/:userId/verify', adminAuth, adminController.verifyUser);
router.patch('/:userId/suspend', adminAuth, adminController.toggleUserSuspend);

module.exports = router;
