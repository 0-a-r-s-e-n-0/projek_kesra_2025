const express = require('express');
const router = express.Router();
const proposalController = require('../Controllers/proposalController');
const userAuth = require('../middlewares/userAuth'); // pastikan token user
const { validateHibahProposal, validateBeasiswaProposal } = require('../Middlewares/validations/validate');
const withFileCleanup = require('../helpers/withFileCleanUPHelper');
const createUploader = require('../Middlewares/multerConfig');

const fileScan = createUploader({
    fields: [
        {
            folderName: 'scan_surat_permohonan',
            allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
            maxSizeMB: 5,
            fieldName: 'scan_surat_permohonan'
        },
        {
            folderName: 'scan_rab',
            allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
            maxSizeMB: 5,
            fieldName: 'scan_rab'
        }
    ]
});

const permohonanScan = createUploader({
    fields: [
        {
            folderName: 'scan_permohonan',
            allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
            maxSizeMB: 5,
            fieldName: 'scan_permohonan'
        }
    ]
});

router.post('/add/hibah', userAuth.userAuth, userAuth.checkSuspendedUser, fileScan, withFileCleanup(validateHibahProposal), proposalController.createHibahProposal);
router.post('/add/beasiswa', userAuth.userAuth, userAuth.checkSuspendedUser, permohonanScan, withFileCleanup(validateBeasiswaProposal), proposalController.createBeasiswaProposal);
router.get('/list/proposal', userAuth.userAuth, userAuth.checkSuspendedUser, proposalController.listMyProposals);
router.get('/:id/get/proposal', userAuth.userAuth, userAuth.checkSuspendedUser, proposalController.getMyProposalDetail);
router.delete('/:id/delete/proposal', userAuth.userAuth, userAuth.checkSuspendedUser, proposalController.deleteMyProposal); // opsional

module.exports = router;