const { sequelize } = require('../index.js');
const { DataTypes } = require('sequelize');

const Donation = sequelize.define("donation", {
    DonationID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    EventID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "event",
            key: "EventID"
        }
    },
    UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "user",
            key: "UserID"
        }
    },
    Amount: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    Restricted: {
        type: DataTypes.BOOLEAN,
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

module.exports = { Donation };