const db = require("../Models");
const { sendSuccess, sendError } = require('../helpers/responseHelper');

const getAllProvinces = async (req, res) => {
    try {
        const provinces = await db.Province.findAll();

        return sendSuccess(res, 200, 'Provinces retrieved successfully', provinces);
    } catch (error) {
        console.error('Error fetching provinces:', error);
        return sendError(res, 500, 'Failed to retrieve provinces data', 'SERVER_ERROR');
    }
};

const getAllRegencies = async (req, res) => {
    try {
        const regencies = await db.Regency.findAll();

        return sendSuccess(res, 200, 'Regencies retrieved successfully', regencies);
    } catch (error) {
        console.error('Error fetching regencies:', error);
        return sendError(res, 500, 'Failed to retrieve regencies data', 'SERVER_ERROR');
    }
};

const getRegenciesByProvince = async (req, res) => {
    try {
        const { provinceId } = req.params;

        const regencies = await db.Regency.findAll({
            where: { province_id: provinceId }
        });

        return sendSuccess(res, 200, 'Regencies by province retrieved successfully', regencies);
    } catch (error) {
        console.error('Error fetching regencies by province:', error);
        return sendError(res, 500, 'Failed to retrieve regencies by province', 'SERVER_ERROR');
    }
};

module.exports = {
    getAllRegencies,
    getRegenciesByProvince,
    getAllProvinces
};
