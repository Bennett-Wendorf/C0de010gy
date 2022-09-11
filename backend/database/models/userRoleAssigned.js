const { sequelize } = require('../index.js');
const { DataTypes } = require('sequelize');

const UserRoleAssigned = sequelize.define("user_role_assigned", {
    UserRoleAssignedID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "user",
            key: "UserID"
        }
    },
    UserRoleID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "user_role",
            key: "UserRoleID"
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

module.exports = { UserRoleAssigned };