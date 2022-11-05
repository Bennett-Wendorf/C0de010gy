const sequelize = require('./sequelize_index');
const Donation = require('./models/donation');
const Program = require('./models/program');
const UserRole = require('./models/userRole');
const User = require('./models/user');
const UserRoleAssigned = require('./models/userRoleAssigned');
const Volunteer = require('./models/volunteer');
const Event = require('./models/event');

// Donation relationships
Donation.belongsTo(Event, { foreignKey: 'EventID' });
Event.hasMany(Donation, { foreignKey: 'EventID' })

Donation.belongsTo(User, { 
    foreignKey: {
        name: 'UserID',
        allowNull: false
    }
});
User.hasMany(Donation, { 
    foreignKey: {
        name: 'UserID',
        allowNull: false
    }
})

Donation.belongsTo(User, {
    foreignKey: {
        name: 'UserIDCreatedBy',
        allowNull: false
    }
});
User.hasMany(Donation, {
    foreignKey: {
        name: 'UserIDCreatedBy',
        allowNull: false
    }
})

Donation.belongsTo(User, {
    foreignKey: {
        name: 'UserIDLastModifiedBy',
        allowNull: false
    }
});
User.hasMany(Donation, {
    foreignKey: {
        name: 'UserIDLastModifiedBy',
        allowNull: false
    }
})

// UserRole relationships
UserRole.belongsToMany(User, { 
    through: UserRoleAssigned, 
    unique: false, 
    foreignKey: "UserRoleID" 
})
User.belongsToMany(UserRole, { 
    through: UserRoleAssigned, 
    unique: false, 
    foreignKey: "UserID" 
})

// Program relationships
Program.belongsTo(Event, { 
    foreignKey: {
        name: 'EventID',
        allowNull: false
    }
});
Event.hasMany(Program, { 
    foreignKey: {
        name: 'EventID',
        allowNull: false
    }
})

// Volunteer relationships
Volunteer.belongsTo(Event, { 
    foreignKey: {
        name: 'EventID',
        allowNull: false
    }
});
Event.hasMany(Volunteer, { 
    foreignKey: {
        name: 'EventID',
        allowNull: false
    }
})

Volunteer.belongsTo(User, { 
    foreignKey: {
        name: 'UserID',
        allowNull: false
    }
});
User.hasMany(Volunteer, { 
    foreignKey: {
        name: 'UserID',
        allowNull: false
    }
})

sequelize.sync()
    .then(() => console.log("Database configured successfully."))
    .catch((err) => console.log(err));

module.exports = { Donation, Event, Program, User, UserRole, Volunteer };