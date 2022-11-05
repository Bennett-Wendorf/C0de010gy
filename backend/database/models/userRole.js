const { DataTypes } = require('sequelize');

const sequelize = require('../sequelize_index');

const UserRole = sequelize.define("UserRole", {
    UserRoleID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    DisplayName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
})

module.exports = UserRole;