const { Donation, Event, Program, User, UserRole, UserRoleAssigned, Volunteer } = require('models')

// Donation keys
Donation.belongsTo(Event);
Event.hasMany(Donation, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Donation.belongsTo(User);
User.hasMany(Donation, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Donation.belongsTo(User);
User.hasMany(Donation, {
    foreignKey: 'UserIDCreatedBy',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Donation.belongsTo(User);
User.hasMany(Donation, {
    foreignKey: 'UserIDLastModifiedBy',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

// Event keys
Event.belongsTo(User);
User.hasMany(Event, {
    foreignKey: 'UserIDCreatedBy',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Event.belongsTo(User);
User.hasMany(Event, {
    foreignKey: 'UserIDLastModifiedBy',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

// Program keys
Program.belongsTo(Event);
Event.hasMany(Program, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Program.belongsTo(User);
User.hasMany(Program, {
    foreignKey: 'UserIDCreatedBy',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Program.belongsTo(User);
User.hasMany(Program, {
    foreignKey: 'UserIDLastModifiedBy',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

// User keys
User.belongsTo(User);
User.hasMany(User, {
    foreignKey: 'UserIDCreatedBy',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

User.belongsTo(User);
User.hasMany(User, {
    foreignKey: 'UserIDLastModifiedBy',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

// User role keys
UserRole.belongsTo(User);
User.hasMany(UserRole, {
    foreignKey: 'UserIDCreatedBy',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

UserRole.belongsTo(User);
User.hasMany(UserRole, {
    foreignKey: 'UserIDLastModifiedBy',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

// User role assigned keys
UserRoleAssigned.belongsTo(User);
User.hasMany(UserRoleAssigned, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

UserRoleAssigned.belongsTo(UserRole);
UserRole.hasMany(UserRoleAssigned, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

UserRoleAssigned.belongsTo(User);
User.hasMany(UserRoleAssigned, {
    foreignKey: 'UserIDCreatedBy',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

UserRoleAssigned.belongsTo(User);
User.hasMany(UserRoleAssigned, {
    foreignKey: 'UserIDLastModifiedBy',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

// Volunteer keys
Volunteer.belongsTo(Event);
Event.hasMany(Volunteer, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Volunteer.belongsTo(User);
User.hasMany(Volunteer, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Volunteer.belongsTo(User);
User.hasMany(Volunteer, {
    foreignKey: 'UserIDCreatedBy',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Volunteer.belongsTo(User);
User.hasMany(Volunteer, {
    foreignKey: 'UserIDLastModifiedBy',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});