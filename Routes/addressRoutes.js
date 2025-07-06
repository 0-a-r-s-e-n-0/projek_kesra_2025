const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const userAuth = require('../Middlewares/userAuth')

router.get('/provinces', userAuth.userAuth, userAuth.checkSuspendedUser, addressController.getAllProvinces);
router.get('/regencies', userAuth.userAuth, userAuth.checkSuspendedUser, addressController.getAllRegencies);
router.get('/province/:provinceId', userAuth.userAuth, userAuth.checkSuspendedUser, addressController.getRegenciesByProvince);

module.exports = router;
