const { DataTypes } = require('sequelize');

const sequelize = require('../sequelize_index');

// The model to represent the Program table in the database
const Program = sequelize.define("Program", {
    ProgramID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    Summary: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    Description: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
})

module.exports = Program;