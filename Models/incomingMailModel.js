const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const IncomingMail = sequelize.define('IncomingMail', {
        mail_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        mail_no: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        mail_file: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        input_by_admin_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'admins',
                key: 'admin_id'
            },
            onDelete: 'SET NULL'
        }
    }, {
        tableName: 'incoming_mail',
        timestamps: true,
        createdAt: 'input_at',
        updatedAt: false,
        underscored: true
    });

    return IncomingMail;
};
