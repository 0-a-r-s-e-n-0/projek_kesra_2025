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

//user
router.post('/add/hibah', userAuth.allUserAuth, fileScan, withFileCleanup(validateHibahProposal), proposalController.createHibahProposal);
router.post('/add/beasiswa', userAuth.allUserAuth, permohonanScan, withFileCleanup(validateBeasiswaProposal), proposalController.createBeasiswaProposal);
router.get('/list', userAuth.userAuth, proposalController.listMyProposals);
router.get('/:id/get', userAuth.userAuth, proposalController.getMyProposalDetail);
router.delete('/:id/delete', userAuth.userAuth, proposalController.deleteMyProposal); // opsional

//admin/super

//kurang 1 get detail
router.get('/list/admin', userAuth.adminAuth, proposalController.getAllProposal);
router.get('/:id/detail/admin', userAuth.adminAuth, proposalController.adminGetProposalDetail);
router.delete('/:id/delete/admin', userAuth.adminAuth, proposalController.adminDeleteProposal);
router.patch('/:id/update/beasiswa/admin', userAuth.adminAuth, permohonanScan, proposalController.adminUpdateBeasiswaProposal);
router.patch('/:id/update/hibah/admin', userAuth.adminAuth, fileScan, proposalController.adminUpdateHibahProposal);

module.exports = router;