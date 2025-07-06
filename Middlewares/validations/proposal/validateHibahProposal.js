const { respondError } = require('../../../helpers/validationHelper');

module.exports = (req, res, next) => {
    const {
        regencies_id, address, surat_from,
        nomor_surat, tanggal_surat, perihal,
        sub_id, nama_pengurus, nominal_anggaran
    } = req.body;

    const missingFields = [];
    if (!regencies_id) missingFields.push('regencies_id');
    if (!address) missingFields.push('address');
    if (!surat_from) missingFields.push('surat_from');
    if (!nomor_surat) missingFields.push('nomor_surat');
    if (!tanggal_surat) missingFields.push('tanggal_surat');
    if (!perihal) missingFields.push('perihal');
    if (!sub_id) missingFields.push('sub_id');
    if (!nama_pengurus) missingFields.push('nama_pengurus');
    if (!nominal_anggaran) missingFields.push('nominal_anggaran');

    if (missingFields.length > 0) {
        return respondError(
            res,
            400,
            `${missingFields.join(', ')} ${missingFields.length > 1 ? 'are' : 'is'} required`,
            'INVALID_INPUT'
        );
    }

    if (address.length < 5)
        return respondError(res, 400, 'Address must be at least 5 characters', 'ADDRESS_TOO_SHORT');

    if (nama_pengurus.length < 3)
        return respondError(res, 400, 'Nama pengurus must be at least 3 characters', 'INVALID_NAME');

    if (isNaN(nominal_anggaran) || Number(nominal_anggaran) <= 0)
        return respondError(res, 400, 'Nominal anggaran must be a valid positive number', 'INVALID_AMOUNT');

    next();
};
