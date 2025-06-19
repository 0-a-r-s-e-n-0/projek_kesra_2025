const express = require('express');
const router = express.Router();
const mailController = require('../Controllers/mailController');
const userAuth = require('../Middlewares/userAuth')



router.get('/incoming', userAuth.userAuth, mailController.getIncomingMails);
router.get('/incoming/:id', userAuth.userAuth, mailController.getIncomingMailById);
router.post('/incoming', userAuth.userAuth, mailController.createIncomingMail);
router.put('/incoming/:id', userAuth.userAuth, mailController.updateIncomingMail);
router.delete('/incoming/:id', userAuth.userAuth, mailController.deleteIncomingMail);

router.get('/outgoing', userAuth.userAuth, mailController.getOutgoingMails);
router.get('/outgoing/:id', userAuth.userAuth, mailController.getOutgoingMailById);
router.post('/outgoing', userAuth.userAuth, mailController.createOutgoingMail);
router.put('/outgoing/:id', userAuth.userAuth, mailController.updateOutgoingMail);
router.delete('/outgoing/:id', userAuth.userAuth, mailController.deleteOutgoingMail);

module.exports = router;