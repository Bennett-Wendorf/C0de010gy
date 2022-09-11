const { sequelize } = require('../index.js');
const { DataTypes } = require('sequelize');

const UserRole = sequelize.define("user_role", {
    UserRoleID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    DisplayName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    SecurityLevel: {
        type: DataTypes.TINYINT,
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

module.exports = { UserRole };