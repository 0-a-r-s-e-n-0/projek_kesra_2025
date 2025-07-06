const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Regency = sequelize.define(
        'Regency',
        {
            regencies_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            province_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            named: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING(10),
                allowNull: false,
                validate: { isIn: [['Kabupaten', 'Kota']] },
            },
        },
        {
            tableName: 'regencies',
            timestamps: false,
            freezeTableName: true,
            indexes: [{ unique: true, fields: ['province_id', 'named'] }],
        }
    );

    return Regency;
};
