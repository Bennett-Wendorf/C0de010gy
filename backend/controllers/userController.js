const { User, UserRole } = require('../database')
const bcrypt = require('bcrypt')

const saltRounds = 10;

const createUser = async (req, res) => {
    const { firstName, lastName, username, email, password, roles } = req.body

    bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
        if (err) {
            res.status(500).send("An unknown error occurred")
        }

        const newUser = await User.create({ 
            FirstName: firstName == "" ? null : firstName, 
            LastName: lastName == "" ? null : lastName, 
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

const addUserRoles = async (req, res) => {
    const userID = req.userID
    const { roles } = req.body

    const user = await User.findOne({ where: { UserID: userID } })

    if (!user) {
        res.status(404).send({ field: 'general', message: "User not found" })
        return
    }

    // TODO: Validate that the roles are valid
    // TODO: Ensure the user doesn't have these roles already before adding them

    await createUserRoles(user, roles)
    const userRoles = await user.getUserRoles()
    console.log(userRoles)
    res.status(200).json({ roles: userRoles, message: "User roles added successfully" })
}

const createUserRoles = async (user, roles) => {
    await Promise.all(roles.map(async (role) => {
        const loggedInUser = await User.findOne({ where: { UserID: user.UserID } })
        const userRole = await UserRole.findOne({ where: { DisplayName: role } })
        await loggedInUser.addUserRole(userRole)
        console.log(`Added role ${role} to user ${user.Username}`)
    }))
}

const validateNewUser = async (req, res, next) => {
    const { firstName, lastName, username, email, password, roles } = req.body

    if (!email.includes('@')) {
        res.status(400).json({ field: 'email', message: 'Email is invalid' })
        return
    }

    if (roles.includes('Administrator')) {
        res.status(403).json({ field: 'general', message: 'You do not have permission to assign admin roles' })
        return
    }

    if (!password.match( /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/g)) {
        res.status(400).json({ field: 'password', message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number' })
        return
    }

    const user = await User.findOne({ where: { Username: username } })

    if (user) {
        res.status(409).send({ field: 'username', message: "A user with that username already exists" })
        return
    }

    next()
}

module.exports = { createUser, addUserRoles, validateNewUser }