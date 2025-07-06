const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const HibahDetail = sequelize.define(
        'HibahDetail',
        {
            proposal_id: { type: DataTypes.UUID, primaryKey: true },
            sub_id: { type: DataTypes.INTEGER, allowNull: false },
            nomor_sekda: DataTypes.STRING(50),
            tgl_nomor_sekda: DataTypes.DATEONLY,
            nomor_gubernur: DataTypes.STRING(50),
            tgl_nomor_gubernur: DataTypes.DATEONLY,
            nama_pengurus: { type: DataTypes.TEXT, allowNull: false },
            nominal_anggaran: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
        },
        { tableName: 'hibah_details', timestamps: false, freezeTableName: true }
    );

    return HibahDetail;
};