const { DataTypes } = require('sequelize');

const sequelize = require('../sequelize_index');

const UserRoleAssigned = sequelize.define("UserRoleAssigned", {
    UserRoleAssignedID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
})

module.exports = UserRoleAssigned;