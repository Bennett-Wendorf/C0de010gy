const { User, UserRoleAssigned, UserRole } = require('../database/models')
const bcrypt = require('bcrypt')

const saltRounds = 10;

// TODO: Add middleware for logging last time user performed an action

const createUser = async (req, res) => {
    const { firstName, lastName, username, email, password, roles } = req.body

    // TODO: Double check validation rules here, or add them to the validation middleware

    const user = await User.findOne({ where: { Username: username } })

    if (user) {
        res.status(409).send({ field: 'username', message: "A user with that username already exists" })
        return
    }

    bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
        if (err) {
            res.status(500).send("An unknown error occurred")
        }

        const newUser = await User.create({ 
            FirstName: firstName, 
            LastName: lastName, 
            Username: username,
            Email: email,
            Password: hashedPassword,
            UserIDCreatedBy: 1,
            UserIDLastModifiedBy: 1,
        })

        if (newUser) {
            res.body = newUser
            createUserRoles(newUser, roles)
            res.status(201).send("New user created successfully")
        } else {
            res.sendStatus(500)
        }
    })
}

// TODO: Improve this with better sequelize integration
const getUserRoles = async (user) => {
    const userRoleAssigneds = await UserRoleAssigned.findAll({ where: { UserID: user.UserID } })
    let toReturn = []
    
    for (let i = 0; i < userRoleAssigneds.length; i++) {
        const userRole = await UserRole.findOne({ where: { UserRoleID: userRoleAssigneds[i].UserRoleID }, attributes: ['DisplayName'] })
        toReturn.push(userRole.DisplayName)
    }

    return toReturn
}

// TODO: Improve this with better sequelize integration
const createUserRoles = async (user, roles) => {
    roles.map(async (role) => {
        const userRole = await UserRole.findOne({ where: { DisplayName: role } })
        await UserRoleAssigned.create({ 
            UserID: user.UserID, 
            UserRoleID: userRole.UserRoleID,
            UserIDCreatedBy: 1,
            UserIDLastModifiedBy: 1,
        })
    })
}

module.exports = { createUser, getUserRoles }