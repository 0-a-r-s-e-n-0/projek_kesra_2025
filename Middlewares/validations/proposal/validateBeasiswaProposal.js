const { respondError } = require('../../../helpers/validationHelper');

module.exports = (req, res, next) => {
    const {
        regencies_id, address, surat_from,
        nomor_surat, tanggal_surat, perihal,
        univ_name, academic_level
    } = req.body;

    const missingFields = [];
    if (!regencies_id) missingFields.push('regencies_id');
    if (!address) missingFields.push('address');
    if (!surat_from) missingFields.push('surat_from');
    if (!nomor_surat) missingFields.push('nomor_surat');
    if (!tanggal_surat) missingFields.push('tanggal_surat');
    if (!perihal) missingFields.push('perihal');
    if (!univ_name) missingFields.push('univ_name');
    if (!academic_level) missingFields.push('academic_level');

    if (!req.files?.scan_permohonan?.[0]) {
        missingFields.push('scan_permohonan');
    }

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

    if (univ_name.length < 3)
        return respondError(res, 400, 'University name must be at least 3 characters', 'INVALID_UNIV_NAME');

    // const allowedLevels = ['S1', 'S2', 'S3'];
    // if (!allowedLevels.includes(academic_level))
    //     return respondError(res, 400, 'Academic level must be one of S1, S2, or S3', 'INVALID_LEVEL');

    next();
};
