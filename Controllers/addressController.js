const db = require("../Models");

const getAllProvinces = async (req, res) => {
    try {
        const provinces = await db.Province.findAll();

        res.status(200).json(provinces);
    } catch (error) {
        console.error('Error fetching provinces:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data provinsi.' });
    }
};

const getAllRegencies = async (req, res) => {
    try {
        const regencies = await db.Regency.findAll();

        res.status(200).json(regencies);
    } catch (error) {
        console.error('Error fetching regencies:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data kabupaten/kota.' });
    }
};

// GET regencies by province_id
const getRegenciesByProvince = async (req, res) => {
    try {
        const { provinceId } = req.params;

        const regencies = await db.Regency.findAll({
            where: { province_id: provinceId }
        });

        res.status(200).json(regencies);
    } catch (error) {
        console.error('Error fetching regencies by province:', error);
        res.status(500).json({ message: 'Gagal mengambil kabupaten/kota dari provinsi tersebut.' });
    }
};

module.exports = {
    getAllRegencies,
    getRegenciesByProvince,
    getAllProvinces
};
