const db = require('../Models');
const generatePaginatedHelper = require('../helpers/generatePaginate');
const IncomingMail = db.IncomingMail;
const OutgoingMail = db.OutgoingMail;
const Admin = db.Admin;
const { Op } = require('sequelize');

const generateMailController = (Model) => ({
    async getAll(req, res) {
        try {
            const { mail_no, input_at, page = 1, limit = 10, sort = 'desc' } = req.query;

            const filters = {};
            if (mail_no) filters.mail_no = { [Op.iLike]: `%${mail_no}%` };
            if (input_at) filters.input_at = new Date(input_at);

            const offset = (parseInt(page) - 1) * parseInt(limit);
            const orderDirection = sort.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

            const { count, rows } = await Model.findAndCountAll({
                where: filters,
                limit: parseInt(limit),
                offset,
                order: [['input_at', orderDirection]]
            });

            return res.json({
                status: 'success',
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit),
                totalItems: count,
                sort: orderDirection,
                data: rows
            });
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                message: err.message
            });
        }
    },

    async getById(req, res) {
        try {
            const result = await Model.findByPk(req.params.id);
            if (!result) return res.status(404).json({ status: 'error', message: 'Not found' });
            return res.json({ status: 'success', data: result });
        } catch (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
    },

    async create(req, res) {
        try {
            const newMail = await Model.create(req.body);
            return res.status(201).json({ status: 'success', data: newMail });
        } catch (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
    },

    async update(req, res) {
        try {
            const updated = await Model.update(req.body, { where: { mail_id: req.params.id } });
            return res.json({ status: 'success', updated });
        } catch (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
    },

    async delete(req, res) {
        try {
            await Model.destroy({ where: { mail_id: req.params.id } });
            return res.json({ status: 'success', message: 'Deleted successfully' });
        } catch (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
    }
});

const mailController = {
    // INCOMING MAIL
    ...generateMailController(IncomingMail),
    ...generatePaginatedHelper(IncomingMail, {
        defaultSortBy: 'input_at',
        allowedSortFields: ['mail_no', 'input_at'],
        searchableFields: ['mail_no'],
        customFilterFields: {
            input_at: (value) => ({
                input_at: new Date(value)
            })
        }
    }),
    getIncomingMailById: generateMailController(IncomingMail).getById,
    createIncomingMail: generateMailController(IncomingMail).create,
    updateIncomingMail: generateMailController(IncomingMail).update,
    deleteIncomingMail: generateMailController(IncomingMail).delete,

    // OUTGOING MAIL
    ...generateMailController(OutgoingMail),
    ...generatePaginatedHelper(OutgoingMail, {
        defaultSortBy: 'input_at',
        allowedSortFields: ['mail_no', 'input_at'],
        searchableFields: ['mail_no'],
        customFilterFields: {
            input_at: (value) => ({
                input_at: new Date(value)
            })
        }
    }),
    getOutgoingMailById: generateMailController(OutgoingMail).getById,
    createOutgoingMail: generateMailController(OutgoingMail).create,
    updateOutgoingMail: generateMailController(OutgoingMail).update,
    deleteOutgoingMail: generateMailController(OutgoingMail).delete
};

module.exports = mailController;
