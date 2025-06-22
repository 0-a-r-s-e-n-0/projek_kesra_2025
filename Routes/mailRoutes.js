const express = require('express');
const router = express.Router();
const mailController = require('../Controllers/mailController');
const auth = require('../Middlewares/userAuth')



// INCOMING MAIL
router.get('/incoming', auth.adminAuth, mailController.getAll);         // GET all (dengan pagination, search, filter, dll)
router.get('/incoming/:id', auth.adminAuth, mailController.getById);              // GET by ID
router.post('/incoming', auth.adminAuth, mailController.create);                  // CREATE
router.put('/incoming/:id', auth.adminAuth, mailController.update);               // UPDATE
router.delete('/incoming/:id', auth.adminAuth, mailController.delete);            // DELETE

// OUTGOING MAIL
router.get('/outgoing', auth.adminAuth, mailController.getAll);         // GET all
router.get('/outgoing/:id', auth.adminAuth, mailController.getById);              // GET by ID
router.post('/outgoing', auth.adminAuth, mailController.create);                  // CREATE
router.put('/outgoing/:id', auth.adminAuth, mailController.update);               // UPDATE
router.delete('/outgoing/:id', auth.adminAuth, mailController.delete);            // DELETE

module.exports = router;