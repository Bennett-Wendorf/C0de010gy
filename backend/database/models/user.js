const { sequelize } = require('../index.js');
const { DataTypes } = require('sequelize');

const User = sequelize.define("user", {
    UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    FirstName: {
        type: DataTypes.STRING
    },
    LastName: {
        type: DataTypes.STRING
    },
    FullName: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.firstName && this.lastName ? `${this.firstName} ${this.lastName}` : "";
        },
        set(value) {
            throw new Error('Do not try to set the `fullName` value!');
        }
    },
    Username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Password: {
        type: DataTypes.STRING,
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

module.exports = { User };