const { sequelize } = require('../index.js');
const { DataTypes } = require('sequelize');

const Volunteer = sequelize.define("volunteer", {
    VolunteerID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "user",
            key: "UserID"
        }
    },
    EventID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "event",
            key: "EventID"
        }
    },
    StartTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    EndTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    UserIDCreatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "user",
            key: "UserID"
        }
    },
    UserIDLastModifiedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "user",
            key: "UserID"
        }
    }
})

module.exports = { Volunteer };