const { DataTypes } = require('sequelize');

const sequelize = require('../sequelize_index');

const Message = sequelize.define("Message", {
    MessageID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    Title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    ReadDateTime: {
        type: DataTypes.DATE,
        allowNull: true
    },
})

module.exports = Message;