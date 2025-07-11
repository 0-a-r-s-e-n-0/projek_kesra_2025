const express = require('express');
const router = express.Router();
const adminAuth = require('../middlewares/userAuth');
const adminController = require('../controllers/superAdminController');

router.use(adminAuth.superAdminAuth);

// CRUD
router.post('/add-admin', adminAuth.superAdminAuth, adminController.createAdmin);
router.get('/admin/all', adminAuth.superAdminAuth, adminController.listAdmins);
router.get('/:id/admin', adminAuth.superAdminAuth, adminController.getAdminDetail);
router.patch('/:id/admin/update', adminAuth.superAdminAuth, adminController.updateAdmin);
router.patch('/:id/admin/suspend', adminAuth.superAdminAuth, adminController.setSuspendAdmin);
router.delete('/:id/admin/delete', adminAuth.superAdminAuth, adminController.deleteAdmin);

module.exports = router;
