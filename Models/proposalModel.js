const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Proposal = sequelize.define(
        'Proposal',
        {
            proposal_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            type_id: DataTypes.INTEGER,
            nomor_TU: { type: DataTypes.STRING(100), allowNull: true, unique: true, field: 'nomor_tu' },
            regencies_id: DataTypes.INTEGER,
            address: { type: DataTypes.TEXT, allowNull: false },
            surat_from: { type: DataTypes.TEXT, allowNull: false },
            nomor_surat: { type: DataTypes.STRING(100), allowNull: false, unique: true },
            tanggal_surat: { type: DataTypes.DATEONLY, allowNull: false },
            perihal: DataTypes.TEXT,
            input_by: { type: DataTypes.UUID, allowNull: true },
            input_by_admin: { type: DataTypes.UUID, allowNull: true },
        },
        {
            tableName: 'proposals',
            underscored: true,
            freezeTableName: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    return Proposal;
};
