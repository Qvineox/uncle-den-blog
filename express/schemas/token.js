const {DataTypes, Sequelize} = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define('token', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        timestamps: false
    })
}