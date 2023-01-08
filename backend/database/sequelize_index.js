const Sequelize = require('sequelize');
const connection = require('./connection.json');

// Generate the sequelize instance
const sequelize = new Sequelize(
    connection.database,
    connection.user,
    connection.password,
    {
        host: connection.host,
        dialect: 'mariadb',
        define: {
            freezeTableName: true,
            timestamps: true,
            createdAt: 'CreatedDateTime', 
            updatedAt: 'LastModifiedDateTime' 
        },
        logging: false
    }
)

module.exports = sequelize;