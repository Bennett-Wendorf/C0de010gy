const { DataTypes } = require('sequelize');

const sequelize = require('../sequelize_index');

// The model to represent the Volunteer table in the database
const Volunteer = sequelize.define("Volunteer", {
    VolunteerID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    StartTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    EndTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
})

module.exports = Volunteer;