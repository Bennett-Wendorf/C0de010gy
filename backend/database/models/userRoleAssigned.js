const { DataTypes } = require('sequelize');

const sequelize = require('../sequelize_index');

// The model to represent the UserRoleAssigned table in the database
const UserRoleAssigned = sequelize.define("UserRoleAssigned", {
    UserRoleAssignedID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
})

module.exports = UserRoleAssigned;