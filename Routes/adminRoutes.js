const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');
const { validateAdminLogin } = require('../Middlewares/validations/validate');

router.post('/login', validateAdminLogin, adminController.login);
// router.post('/register', validateAdminRegister, adminController.register); // opsional, bisa manual insert

module.exports = router;
