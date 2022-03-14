const {DataTypes} = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define('adventure', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(250),
            allowNull: true,
            default: 'Описание отсутствует'
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        finishDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        distance: {
            type: DataTypes.DECIMAL,
            defaultValue: 0
        },
        path: {
            type: DataTypes.JSON,
            defaultValue: [],
            allowNull: true
        },
        map: {
            type: DataTypes.JSONB,
            defaultValue: {},
            allowNull: true
        }
    }, {
        timestamps: true
    })
}