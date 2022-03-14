const {DataTypes} = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define('post', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        order: {
            type: DataTypes.SMALLINT,
            allowNull: true,
            unique: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.JSONB,
            defaultValue: {},
            allowNull: true
        }
    }, {
        timestamps: true
    })
}