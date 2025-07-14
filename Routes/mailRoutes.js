const express = require('express');
const router = express.Router();
const mailController = require('../Controllers/mailController');
const auth = require('../Middlewares/userAuth')
const createUploader = require('../Middlewares/multerConfig');

const suratMasuk = createUploader({
    fields: [
        {
            folderName: 'surat_masuk',
            allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
            maxSizeMB: 5,
            fieldName: 'mail_file'
        }
    ]
});

const suratKeluar = createUploader({
    fields: [
        {
            folderName: 'surat_keluar',
            allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
            maxSizeMB: 5,
            fieldName: 'mail_file'
        }
    ]
});

// INCOMING MAIL
router.get('/incoming', auth.adminAuth, mailController.getAll);         // GET all (dengan pagination, search, filter, dll)
router.get('/incoming/:id', auth.adminAuth, mailController.getById);              // GET by ID
router.post('/incoming', auth.adminAuth, suratMasuk, mailController.create);                  // CREATE
router.put('/incoming/:id', auth.adminAuth, mailController.update);               // UPDATE
router.delete('/incoming/:id', auth.adminAuth, mailController.delete);            // DELETE

// OUTGOING MAIL
router.get('/outgoing', auth.adminAuth, mailController.getAll);         // GET all
router.get('/outgoing/:id', auth.adminAuth, mailController.getById);              // GET by ID
router.post('/outgoing', auth.adminAuth, suratKeluar, mailController.create);                  // CREATE
router.put('/outgoing/:id', auth.adminAuth, mailController.update);               // UPDATE
router.delete('/outgoing/:id', auth.adminAuth, mailController.delete);            // DELETE

module.exports = router;