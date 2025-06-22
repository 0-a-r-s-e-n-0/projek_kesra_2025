const { Op } = require('sequelize');
const { PaginationSendSuccess } = require('./responseHelper');

const generatePaginatedHelper = (Model, options = {}) => {
    const {
        defaultSortBy = 'createdAt',
        allowedSortFields = ['createdAt', 'updatedAt'],
        searchableFields = [],
        include = [],
        customFilterFields = {},
        defaultLimit = 10,
        maxLimit = 100
    } = options;

    return {
        async getAll(req, res) {
            try {
                const {
                    search,
                    sort_by = defaultSortBy,
                    sort = 'desc',
                    page = 1,
                    limit = defaultLimit,
                    ...filters
                } = req.query;

                const where = {};

                // Search support
                if (search && searchableFields.length) {
                    where[Op.or] = searchableFields.map(field => ({
                        [field]: { [Op.iLike]: `%${search}%` }
                    }));
                }

                // Filter support
                for (const key in filters) {
                    if (filters[key] !== undefined) {
                        if (customFilterFields[key]) {
                            Object.assign(where, customFilterFields[key](filters[key]));
                        } else if (filters[key] === 'true' || filters[key] === 'false') {
                            where[key] = filters[key] === 'true';
                        } else {
                            where[key] = filters[key];
                        }
                    }
                }

                // Pagination & sorting
                const offset = (parseInt(page) - 1) * parseInt(limit);
                const safeLimit = Math.min(parseInt(limit), maxLimit);
                const orderField = allowedSortFields.includes(sort_by) ? sort_by : defaultSortBy;
                const orderDirection = sort.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

                const { count, rows } = await Model.findAndCountAll({
                    where,
                    include,
                    order: [[orderField, orderDirection]],
                    limit: safeLimit,
                    offset
                });

                return PaginationSendSuccess(res, 200, `${Model.name} data fetched successfully`, {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / safeLimit),
                    totalItems: count,
                    itemsPerPage: safeLimit,
                    sort_by,
                    sort,
                    data: rows
                });

            } catch (err) {
                console.error(`Get all ${Model.name} error:`, err);
                return res.status(500).json({
                    status: 'error',
                    statusCode: 500,
                    message: `Failed to fetch ${Model.name} data due to server error`,
                    errorCode: 'SERVER_ERROR'
                });
            }
        }
    };
};

module.exports = generatePaginatedHelper;
