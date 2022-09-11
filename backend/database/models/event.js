const { sequelize } = require('../index.js');
const { DataTypes } = require('sequelize');

const Event = sequelize.define("event", {
    EventID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    Summary: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Description: {
        type: DataTypes.STRING,
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
    UserIDCreatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "user",
            key: "UserID"
        }
    },
    CreatedDateTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    UserIDLastModifiedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "user",
            key: "UserID"
        }
    },
    LastModifiedDateTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
})

module.exports = { Event };