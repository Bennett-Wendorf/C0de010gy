const { DataTypes } = require('sequelize');

const sequelize = require('../sequelize_index');

const Donation = sequelize.define("Donation", {
    DonationID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    Amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
})

module.exports = Donation;