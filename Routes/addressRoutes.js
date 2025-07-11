const express = require('express');
const router = express.Router();
const addressController = require('../Controllers/addressController');
const userAuth = require('../Middlewares/userAuth')

router.get('/provinces', userAuth.adminAuth, addressController.getAllProvinces);
router.get('/regencies', addressController.getAllRegencies);
router.get('/province/:provinceId', userAuth.adminAuth, addressController.getRegenciesByProvince);

module.exports = router;
