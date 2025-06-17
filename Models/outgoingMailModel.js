const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const OutgoingMail = sequelize.define('OutgoingMail', {
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
        input_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        input_by_admin_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'admins',
                key: 'admin_id'
            },
            onDelete: 'SET NULL'
        },
    }, {
        tableName: 'outgoing_mail',
        timestamps: false
    });

    return OutgoingMail;
};