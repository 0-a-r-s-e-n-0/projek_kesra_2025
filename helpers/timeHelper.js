const { DateTime } = require('luxon');

const formatToWIB = (dateInput) => {
    if (!dateInput) return null;

    return DateTime
        .fromJSDate(new Date(dateInput))         // konversi dari Date
        .setZone('Asia/Jakarta')                 // ubah zona ke WIB
        .toFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZZ"); // format ISO + zona
};

module.exports = {
    formatToWIB
};
