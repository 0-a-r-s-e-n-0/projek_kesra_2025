// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../Controllers/dahsboardController');

router.get('/dashboard', dashboardController);

module.exports = router;
