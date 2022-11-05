const { DataTypes } = require("sequelize")

const sequelize = require("../sequelize_index")

const Event = sequelize.define("Event", {
    EventID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    Summary: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    Description: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    StartTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    EndTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    NeededVolunteers: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    Location: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    VolunteerQualifications: {
        type: DataTypes.STRING(250),
        allowNull: true
    },
})

module.exports = Event