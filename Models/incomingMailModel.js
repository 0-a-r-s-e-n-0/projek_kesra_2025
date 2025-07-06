const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const IncomingMail = sequelize.define(
        'IncomingMail',
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
            tableName: 'incoming_mail',
            underscored: true,
            freezeTableName: true,
            timestamps: false,
        }
    );

    return IncomingMail;
};