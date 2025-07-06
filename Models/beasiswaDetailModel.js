const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const BeasiswaDetail = sequelize.define(
        'BeasiswaDetail',
        {
            proposal_id: { type: DataTypes.UUID, primaryKey: true },
            univ_name: { type: DataTypes.TEXT, allowNull: false },
            academic_level: { type: DataTypes.INTEGER, allowNull: false },
            scan_permohonan_path: { type: DataTypes.TEXT, allowNull: false },
        },
        { tableName: 'beasiswa_details', timestamps: false, freezeTableName: true }
    );

    return BeasiswaDetail;
};