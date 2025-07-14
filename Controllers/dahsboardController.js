// controllers/dashboardController.js
const { Proposal, HibahDetail, BeasiswaDetail, Attachment, IncomingMail, OutgoingMail } = require('../Models');
const { Op } = require('sequelize');
const getTodayRange = require('../helpers/times');

const dashboardController = async (req, res) => {
    const { start, end } = getTodayRange();

    try {
        // ============================= Summary Counts =============================
        const [
            totalProposals,
            totalHibah,
            totalBeasiswa,
            totalAttachments,
            totalIncomingMail,
            totalOutgoingMail
        ] = await Promise.all([
            Proposal.count({ where: { created_at: { [Op.between]: [start, end] } } }),
            Proposal.count({
                where: { created_at: { [Op.between]: [start, end] } },
                include: { model: HibahDetail, as: 'hibah_detail', required: true },
            }),
            Proposal.count({
                where: { created_at: { [Op.between]: [start, end] } },
                include: { model: BeasiswaDetail, as: 'beasiswa_detail', required: true },
            }),
            Attachment.count({ where: { uploaded_at: { [Op.between]: [start, end] } } }),
            IncomingMail.count({ where: { input_at: { [Op.between]: [start, end] } } }),
            OutgoingMail.count({ where: { input_at: { [Op.between]: [start, end] } } }),
        ]);

        // ============================= List Data =============================
        const proposals = await Proposal.findAll({
            where: { created_at: { [Op.between]: [start, end] } },
            attributes: ['proposal_id', 'nomor_surat', 'perihal', 'surat_from', 'created_at'],
            order: [['created_at', 'DESC']],
        });

        const incomingMail = await IncomingMail.findAll({
            where: { input_at: { [Op.between]: [start, end] } },
            attributes: ['mail_id', 'mail_no', 'mail_file', 'mail_date', 'input_at'],
            order: [['input_at', 'DESC']],
        });

        const outgoingMail = await OutgoingMail.findAll({
            where: { input_at: { [Op.between]: [start, end] } },
            attributes: ['mail_id', 'mail_no', 'mail_file', 'mail_date', 'input_at'],
            order: [['input_at', 'DESC']],
        });

        // ============================= Response =============================
        res.json({
            summary: {
                totalProposals,
                totalHibah,
                totalBeasiswa,
                totalAttachments,
                totalIncomingMail,
                totalOutgoingMail
            },
            proposals,
            incomingMail,
            outgoingMail
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Gagal ambil data dashboard' });
    }
};

module.exports = dashboardController;
