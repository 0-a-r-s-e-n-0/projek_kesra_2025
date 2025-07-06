const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const OutgoingMail = sequelize.define(
        'OutgoingMail',
        {
            mail_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            mail_no: { type: DataTypes.TEXT, allowNull: false },
            mail_file: { type: DataTypes.TEXT, allowNull: false },
            input_by_admin_id: DataTypes.UUID,
        },
        {
            tableName: 'outgoing_mail',
            underscored: true,
            freezeTableName: true,
            timestamps: false,
        }
    );

    return OutgoingMail;
};