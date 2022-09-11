const { Sequelize } = require('sequelize');
const connection = require('./connection.json');

const sequelize = new Sequelize(
    connection.database,
    connection.user,
    connection.password,
    {
        host: connection.host,
        dialect: 'mariadb',
    },
    {
        freezeTableName: true
    }
)

module.exports = { sequelize };