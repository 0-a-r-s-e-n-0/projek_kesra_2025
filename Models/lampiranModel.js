const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Attachment = sequelize.define(
        'Attachment',
        {
            attach_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            proposal_id: { type: DataTypes.UUID, allowNull: false },
            kind: {
                type: DataTypes.ENUM('surat_permohonan', 'rab', 'permohonan_beasiswa'),
                allowNull: false,
            },
            file_name: DataTypes.TEXT,
            file_path: DataTypes.TEXT,
            file_size: DataTypes.INTEGER,
        },
        {
            tableName: 'attachments',
            underscored: true,
            freezeTableName: true,
            timestamps: true,
            createdAt: 'uploaded_at',
            updatedAt: false,
        }
    );

    return Attachment;
};
