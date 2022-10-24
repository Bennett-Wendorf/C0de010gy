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
        allowNull: true,
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

module.exports = { Donation };