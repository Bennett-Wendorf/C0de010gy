const { DataTypes } = require('sequelize');

const sequelize = require('../sequelize_index');

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
        unique: true
    },
    Email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    Password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
})

module.exports = User;