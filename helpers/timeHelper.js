const { DateTime } = require('luxon');

const formatToWIB = (dateInput) => {
    if (!dateInput) return null;

    let dt = typeof dateInput === 'string'
        ? DateTime.fromISO(dateInput)
        : DateTime.fromJSDate(new Date(dateInput));

    return dt.setZone('Asia/Jakarta').toFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZZ");
};

module.exports = {
    formatToWIB
};
