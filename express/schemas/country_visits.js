const {DataTypes} = require("sequelize");

module.exports = function (sequelize) {
    return sequelize.define('country_visits', {
        latestVisit: {
            type: DataTypes.DATE,
            allowNull: true
        },
    }, {
        timestamps: false
    })
}