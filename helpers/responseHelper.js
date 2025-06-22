const sendSuccess = (res, code, message, data) =>
    res.status(code).json({ status: 'success', statusCode: code, message, data });

const sendError = (res, code, message, errorCode) =>
    res.status(code).json({ status: 'error', statusCode: code, message, errorCode });

const PaginationSendSuccess = (
    res,
    code = 200,
    message = 'Data fetched successfully',
    {
        currentPage = 1,
        totalPages = 1,
        totalItems = 0,
        itemsPerPage = 10,
        sort_by = 'createdAt',
        sort = 'desc',
        filters = {},
        data = []
    }
) => {
    return res.status(code).json({
        status: 'success',
        statusCode: code,
        message,
        currentPage: parseInt(currentPage) || 1,
        totalPages: parseInt(totalPages) || 1,
        totalItems: parseInt(totalItems) || 0,
        itemsPerPage: parseInt(itemsPerPage) || 10,
        sort_by,
        sort: sort.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
        filters,
        data
    });
};


module.exports = { sendSuccess, PaginationSendSuccess, sendError };
