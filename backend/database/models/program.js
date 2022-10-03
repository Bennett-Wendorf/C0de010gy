const { sequelize } = require('../index.js');
const { DataTypes } = require('sequelize');

const Program = sequelize.define("program", {
    ProgramID: {
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
    EventID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "event",
            key: "EventID"
        }
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

module.exports = { Program };