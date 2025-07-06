const db = require('../Models');
const { sendSuccess, sendError } = require('../helpers/responseHelper');
const { getUploadedFilePath, deleteUploadedFile } = require('../helpers/fileHelper');
const { Op } = require('sequelize');
const { formatToWIB } = require('../helpers/timeHelper');

const Proposal = db.Proposal;
const HibahDetail = db.HibahDetail;
const BeasiswaDetail = db.BeasiswaDetail;
const Attachment = db.Attachment;
const ProposalType = db.ProposalType;

const createHibahProposal = async (req, res) => {
    console.log(`🔵 [${req.requestId}] START createHibahProposal`);
    const t = await db.sequelize.transaction();
    try {
        const userId = req.user?.user_id;
        if (!userId)
            return sendError(res, 403, 'Unauthorized or unverified user', 'UNAUTHORIZED');

        const {
            regencies_id, address, surat_from,
            nomor_surat, tanggal_surat, perihal,
            sub_id, nomor_sekda, tgl_nomor_sekda,
            nomor_gubernur, tgl_nomor_gubernur,
            nama_pengurus, nominal_anggaran
        } = req.body;


        /* 1️⃣ proposal induk */
        const proposal = await Proposal.create({
            type_id: 1,                 // 1 = Hibah
            regencies_id,
            address,
            surat_from,
            nomor_surat,
            tanggal_surat,
            perihal,
            input_by: userId,
        }, { transaction: t });
        console.log(`🟢 [${req.requestId}] Proposal ID: ${proposal.proposal_id}`);

        /* 2️⃣ detail hibah */
        await HibahDetail.create({
            proposal_id: proposal.proposal_id,
            sub_id,
            nomor_sekda,
            tgl_nomor_sekda,
            nomor_gubernur,
            tgl_nomor_gubernur,
            nama_pengurus,
            nominal_anggaran
        }, { transaction: t });
        console.log(`🟢 [${req.requestId}] HibahDetail created`);

        /* 3️⃣ lampiran (opsional) */
        const attachments = [];
        for (const [field, kind] of [
            ['scan_surat_permohonan', 'surat_permohonan'],
            ['scan_rab', 'rab']
        ]) {
            const file = req.files?.[field]?.[0];
            if (file) {
                attachments.push({
                    proposal_id: proposal.proposal_id,
                    kind,
                    file_name: file.originalname,
                    file_path: getUploadedFilePath(file),
                    file_size: file.size
                });
            }
        }
        if (attachments.length)
            await Attachment.bulkCreate(attachments, { transaction: t });

        await t.commit();
        console.log(`✅ [${req.requestId}] Transaction committed`);
        return sendSuccess(res, 201, 'Proposal Hibah submitted', { proposal_id: proposal.proposal_id });

    } catch (err) {
        await t.rollback();
        deleteUploadedFile(req.files);
        console.error('Create Hibah error:', err);
        return sendError(res, 500, 'Server error', 'SERVER_ERROR');
    }
};

const createBeasiswaProposal = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const userId = req.user?.user_id;
        if (!userId)
            return sendError(res, 403, 'Unauthorized or unverified user', 'UNAUTHORIZED');

        const {
            regencies_id, address, surat_from,
            nomor_surat, tanggal_surat, perihal,
            univ_name, academic_level
        } = req.body;

        // file wajib
        const file = req.files?.scan_permohonan?.[0];
        if (!file)
            return sendError(res, 400, 'scan_permohonan file is required', 'FILE_REQUIRED');

        /* 1️⃣ proposal induk */
        const proposal = await Proposal.create({
            type_id: 2,                 // 2 = Beasiswa
            regencies_id,
            address,
            surat_from,
            nomor_surat,
            tanggal_surat,
            perihal,
            input_by: userId
        }, { transaction: t });

        /* 2️⃣ detail beasiswa */
        await BeasiswaDetail.create({
            proposal_id: proposal.proposal_id,
            univ_name,
            academic_level,
            scan_permohonan_path: getUploadedFilePath(file)
        }, { transaction: t });

        await t.commit();
        return sendSuccess(res, 201, 'Proposal Beasiswa submitted', { proposal_id: proposal.proposal_id });

    } catch (err) {
        await t.rollback();
        deleteUploadedFile(req.files);
        console.error('Create Beasiswa error:', err);
        return sendError(res, 500, 'Server error', 'SERVER_ERROR');
    }
};

const listMyProposals = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.user_id) {
            return sendError(res, 403, 'Unauthorized', 'UNAUTHORIZED');
        }

        const proposals = await Proposal.findAll({
            where: { input_by: user.user_id },
            include: [
                { model: ProposalType, as: 'type' }
            ],
            order: [['created_at', 'DESC']]
        });

        return sendSuccess(res, 200, 'Your proposals fetched successfully', proposals);

    } catch (err) {
        console.error('List user proposals error:', err);
        return sendError(res, 500, 'Failed to retrieve proposals', 'SERVER_ERROR');
    }
};

const getMyProposalDetail = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;

        const proposal = await Proposal.findByPk(id, {
            include: [
                { model: ProposalType, as: 'type' },
                { model: HibahDetail, as: 'hibah_detail' },
                { model: BeasiswaDetail, as: 'beasiswa_detail' },
                { model: Attachment, as: 'attachments' }
            ]
        });

        if (!proposal || proposal.input_by !== user.user_id) {
            return sendError(res, 403, 'Access denied to this proposal', 'FORBIDDEN');
        }

        return sendSuccess(res, 200, 'Proposal detail retrieved', proposal);

    } catch (err) {
        console.error('Get proposal detail error:', err);
        return sendError(res, 500, 'Failed to get proposal detail', 'SERVER_ERROR');
    }
};

const deleteMyProposal = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const t = await db.sequelize.transaction();

    try {
        const proposal = await Proposal.findByPk(id, {
            include: [{ model: Attachment, as: 'attachments' }]
        });

        if (!proposal || proposal.input_by !== user.user_id) {
            return sendError(res, 403, 'Unauthorized to delete this proposal', 'FORBIDDEN');
        }

        if (proposal.attachments?.length) {
            proposal.attachments.forEach((a) => deleteUploadedFile({ path: a.file_path }));
        }

        await Proposal.destroy({ where: { proposal_id: id }, transaction: t });
        await t.commit();

        return sendSuccess(res, 200, 'Proposal deleted successfully');

    } catch (err) {
        await t.rollback();
        console.error('Delete proposal error:', err);
        return sendError(res, 500, 'Failed to delete proposal', 'SERVER_ERROR');
    }
};

module.exports = {
    createHibahProposal,
    createBeasiswaProposal,
    getMyProposalDetail,
    listMyProposals,
    deleteMyProposal
};