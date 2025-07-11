const db = require('../Models');
const { sendSuccess, sendError } = require('../helpers/responseHelper');
const { getUploadedFilePath, deleteUploadedFile } = require('../helpers/fileHelper');
const generatePaginatedHelper = require('../helpers/generatePaginate');
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
        const userId = req.user?.id;
        const userRole = req.user?.role;

        if (!userRole || !['user', 'admin', 'super_admin'].includes(userRole)) {
            return sendError(res, 403, 'Unauthorized user role', 'UNAUTHORIZED');
        }


        let input_by = null;
        let input_by_admin = null;

        if (userRole === 'user') {
            input_by = userId;
        } else if (userRole === 'admin') {
            input_by_admin = userId;
        }
        const {
            regencies_id, nomor_TU, address, surat_from,
            nomor_surat, tanggal_surat, perihal,
            sub_id, nomor_sekda, tgl_nomor_sekda,
            nomor_gubernur, tgl_nomor_gubernur,
            nama_pengurus, nominal_anggaran
        } = req.body;

        // 🔍 Cek apakah nomor_surat sudah ada
        const existing = await db.Proposal.findOne({ where: { nomor_surat } });
        if (existing) {
            return sendError(res, 400, 'Nomor surat sudah digunakan', 'NOMOR_SURAT_EXISTS');
        }

        const existingTU = await db.Proposal.findOne({ where: { nomor_TU } });
        if (existingTU) {
            return sendError(res, 400, 'Nomor TU sudah digunakan', 'NOMOR_TU_EXISTS');
        }

        let existingNS = null;
        if (nomor_sekda) {
            existingNS = await db.Proposal.findOne({ where: { nomor_sekda } });
            if (existingNS) {
                return sendError(res, 400, 'Nomor sekda sudah digunakan', 'NOMOR_SEKDA_EXISTS');
            }
        }

        let existingNG = null;
        if (nomor_gubernur) {
            existingNG = await db.Proposal.findOne({ where: { nomor_gubernur } });
            if (existingNG) {
                return sendError(res, 400, 'Nomor gubenur sudah digunakan', 'NOMOR_GUBENUR_EXISTS');
            }
        }




        /* 1️⃣ proposal induk */
        const proposal = await Proposal.create({
            type_id: 1,                 // 1 = Hibah
            nomor_TU,
            regencies_id,
            address,
            surat_from,
            nomor_surat,
            tanggal_surat,
            perihal,
            input_by,
            input_by_admin
        }, { transaction: t });

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

        /* 3️⃣ lampiran (opsional) */
        const attachments = [];
        for (const [field, kind] of [
            ['scan_surat_permohonan', 'surat_permohonan'],
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
        const userId = req.user?.id;
        const userRole = req.user?.role;

        if (!userRole || !['user', 'admin', 'super_admin'].includes(userRole)) {
            return sendError(res, 403, 'Unauthorized user role', 'UNAUTHORIZED');
        }


        let input_by = null;
        let input_by_admin = null;

        if (userRole === 'user') {
            input_by = userId;
        } else if (userRole === 'admin') {
            input_by_admin = userId;
        }

        const {
            regencies_id, nomor_TU, address, surat_from,
            nomor_surat, tanggal_surat, perihal,
            univ_name, academic_level
        } = req.body;

        // file wajib
        const file = req.files?.scan_permohonan?.[0];
        if (!file)
            return sendError(res, 400, 'scan_permohonan file is required', 'FILE_REQUIRED');

        const existingTU = await db.Proposal.findOne({ where: { nomor_TU } });
        if (existingTU) {
            return sendError(res, 400, 'Nomor TU sudah digunakan', 'NOMOR_TU_EXISTS');
        }

        // 🔍 Cek apakah nomor_surat sudah ada
        const existing = await db.Proposal.findOne({ where: { nomor_surat } });
        if (existing) {
            return sendError(res, 400, 'Nomor surat sudah digunakan', 'NOMOR_SURAT_EXISTS');
        }

        /* 1️⃣ proposal induk */
        const proposal = await Proposal.create({
            type_id: 2,                 // 2 = Beasiswa
            regencies_id,
            nomor_TU,
            address,
            surat_from,
            nomor_surat,
            tanggal_surat,
            perihal,
            input_by,
            input_by_admin
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

const getAllProposal = generatePaginatedHelper(Proposal, {
    defaultSortBy: 'created_at',
    allowedSortFields: ['created_at', 'updated_at', 'nomor_surat'],
    searchableFields: ['nomor_surat', 'perihal', 'surat_from'],
    include: [
        { model: ProposalType, as: 'type' },
        { model: HibahDetail, as: 'hibah_detail' },
        { model: BeasiswaDetail, as: 'beasiswa_detail' }
    ],
    customFilterFields: {
        type_id: (value) => ({ type_id: value }),
        regencies_id: (value) => ({ regencies_id: value }),
    },
}).getAll;

// 🔍 Get proposal detail (admin/super admin)
const adminGetProposalDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const proposal = await Proposal.findByPk(id, {
            include: [
                { model: ProposalType, as: 'type' },
                { model: HibahDetail, as: 'hibah_detail' },
                { model: BeasiswaDetail, as: 'beasiswa_detail' },
                { model: Attachment, as: 'attachments' }
            ]
        });

        if (!proposal) {
            return sendError(res, 404, 'Proposal not found', 'NOT_FOUND');
        }

        return sendSuccess(res, 200, 'Proposal detail retrieved', proposal);

    } catch (err) {
        console.error('Admin get proposal detail error:', err);
        return sendError(res, 500, 'Failed to retrieve proposal detail', 'SERVER_ERROR');
    }
};

// 🗑️ Delete proposal (admin/super admin)
const adminDeleteProposal = async (req, res) => {
    const { id } = req.params;
    const t = await db.sequelize.transaction();

    try {
        const proposal = await Proposal.findByPk(id, {
            include: [{ model: Attachment, as: 'attachments' }]
        });

        if (!proposal) {
            return sendError(res, 404, 'Proposal not found', 'NOT_FOUND');
        }

        if (proposal.attachments?.length) {
            proposal.attachments.forEach((a) => deleteUploadedFile({ path: a.file_path }));
        }

        await Proposal.destroy({ where: { proposal_id: id }, transaction: t });
        await t.commit();

        return sendSuccess(res, 200, 'Proposal deleted successfully');
    } catch (err) {
        await t.rollback();
        console.error('Admin delete proposal error:', err);
        return sendError(res, 500, 'Failed to delete proposal', 'SERVER_ERROR');
    }
};

const adminUpdateHibahProposal = async (req, res) => {
    const { id } = req.params;
    const {
        perihal, tanggal_surat, nomor_surat, nomor_TU, progress,
        sub_id, nomor_sekda, tgl_nomor_sekda,
        nomor_gubernur, tgl_nomor_gubernur,
        nama_pengurus, nominal_anggaran
    } = req.body;

    const t = await db.sequelize.transaction();
    try {
        const proposal = await Proposal.findByPk(id, {
            include: [{ model: HibahDetail, as: 'hibah_detail' }]
        });

        if (!proposal || proposal.type_id !== 1) {
            return sendError(res, 404, 'Proposal Hibah not found', 'NOT_FOUND');
        }

        // Validasi konflik
        if (nomor_surat && nomor_surat !== proposal.nomor_surat) {
            const existing = await Proposal.findOne({ where: { nomor_surat } });
            if (existing) return sendError(res, 400, 'Nomor surat sudah digunakan', 'NOMOR_SURAT_EXISTS');
        }

        if (nomor_TU && nomor_TU !== proposal.nomor_TU) {
            const existingTU = await Proposal.findOne({ where: { nomor_TU } });
            if (existingTU) return sendError(res, 400, 'Nomor TU sudah digunakan', 'NOMOR_TU_EXISTS');
        }

        if (nomor_sekda && nomor_sekda !== proposal.hibah_detail?.nomor_sekda) {
            const existingNS = await HibahDetail.findOne({ where: { nomor_sekda } });
            if (existingNS) return sendError(res, 400, 'Nomor Sekda sudah digunakan', 'NOMOR_SEKDA_EXISTS');
        }

        if (nomor_gubernur && nomor_gubernur !== proposal.hibah_detail?.nomor_gubernur) {
            const existingNG = await HibahDetail.findOne({ where: { nomor_gubernur } });
            if (existingNG) return sendError(res, 400, 'Nomor Gubernur sudah digunakan', 'NOMOR_GUBERNUR_EXISTS');
        }

        // Update Proposal
        await proposal.update({
            perihal, tanggal_surat, nomor_surat, nomor_TU, progress
        }, { transaction: t });

        // Update Detail Hibah
        await proposal.hibah_detail.update({
            sub_id, nomor_sekda, tgl_nomor_sekda,
            nomor_gubernur, tgl_nomor_gubernur,
            nama_pengurus, nominal_anggaran
        }, { transaction: t });

        // Update File (opsional)
        const newFile = req.files?.scan_surat_permohonan?.[0];
        if (newFile) {
            const existingFile = await Attachment.findOne({
                where: { proposal_id: proposal.proposal_id, kind: 'surat_permohonan' }
            });

            if (existingFile) {
                deleteUploadedFile({ path: existingFile.file_path });
                await existingFile.update({
                    file_name: newFile.originalname,
                    file_path: getUploadedFilePath(newFile),
                    file_size: newFile.size
                }, { transaction: t });
            } else {
                await Attachment.create({
                    proposal_id: proposal.proposal_id,
                    kind: 'surat_permohonan',
                    file_name: newFile.originalname,
                    file_path: getUploadedFilePath(newFile),
                    file_size: newFile.size
                }, { transaction: t });
            }
        }

        await t.commit();
        return sendSuccess(res, 200, 'Proposal Hibah updated successfully');
    } catch (err) {
        await t.rollback();
        console.error('Update Hibah error:', err);
        return sendError(res, 500, 'Failed to update hibah proposal', 'SERVER_ERROR');
    }
};

const adminUpdateBeasiswaProposal = async (req, res) => {
    const { id } = req.params;
    const {
        perihal, tanggal_surat, nomor_surat, nomor_TU, progress,
        univ_name, academic_level
    } = req.body;

    const t = await db.sequelize.transaction();
    try {
        const proposal = await Proposal.findByPk(id, {
            include: [{ model: BeasiswaDetail, as: 'beasiswa_detail' }]
        });

        if (!proposal || proposal.type_id !== 2) {
            return sendError(res, 404, 'Proposal Beasiswa not found', 'NOT_FOUND');
        }

        // Validasi
        if (nomor_surat && nomor_surat !== proposal.nomor_surat) {
            const existing = await Proposal.findOne({ where: { nomor_surat } });
            if (existing) return sendError(res, 400, 'Nomor surat sudah digunakan', 'NOMOR_SURAT_EXISTS');
        }

        if (nomor_TU && nomor_TU !== proposal.nomor_TU) {
            const existingTU = await Proposal.findOne({ where: { nomor_TU } });
            if (existingTU) return sendError(res, 400, 'Nomor TU sudah digunakan', 'NOMOR_TU_EXISTS');
        }

        // Update Proposal
        await proposal.update({
            perihal, tanggal_surat, nomor_surat, nomor_TU, progress
        }, { transaction: t });

        // Update Beasiswa Detail
        await proposal.beasiswa_detail.update({
            univ_name, academic_level
        }, { transaction: t });

        // Update File jika ada
        const newFile = req.files?.scan_permohonan?.[0];
        if (newFile) {
            await proposal.beasiswa_detail.update({
                scan_permohonan_path: getUploadedFilePath(newFile)
            }, { transaction: t });
        }

        await t.commit();
        return sendSuccess(res, 200, 'Proposal Beasiswa updated successfully');
    } catch (err) {
        await t.rollback();
        console.error('Update Beasiswa error:', err);
        return sendError(res, 500, 'Failed to update beasiswa proposal', 'SERVER_ERROR');
    }
};

module.exports = {
    createHibahProposal,
    createBeasiswaProposal,
    getMyProposalDetail,
    listMyProposals,
    deleteMyProposal,
    getAllProposal,
    adminGetProposalDetail,
    adminDeleteProposal,
    adminUpdateBeasiswaProposal,
    adminUpdateHibahProposal
};
