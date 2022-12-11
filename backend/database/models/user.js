const { DataTypes } = require('sequelize');

const sequelize = require('../sequelize_index');

// The model to represent the User table in the database
const User = sequelize.define("User", {
    UserID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    FirstName: {
        type: DataTypes.STRING(50)
    },
    LastName: {
        type: DataTypes.STRING(50)
    },
    FullName: {
        type: DataTypes.VIRTUAL,
        get() {
            return `${this.FirstName ?? ""} ${this.LastName ?? ""}`;
        },
        set(value) {
            throw new Error('Do not try to set the `fullName` value!');
        }
    },
    Username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: 'Username'
    },
    Email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    Password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
})

module.exports = User;