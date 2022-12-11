const { User, UserRole, Volunteer, Donation, Event } = require('../database')
const bcrypt = require('bcrypt')
const { Op } = require('sequelize')

const saltRounds = 10;

/**
 * Get all users
 * @param {Request} req 
 * @param {Response} res 
 */
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['Password']},
            order: [
                ['Active', 'DESC']
            ],
            include: [
                {
                    model: UserRole,
                }
            ]
        })

        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ field: 'general', message: 'Something went wrong!', error: error.message })
    }
}

/**
 * Delete a user
 * @param {Request} req
 * @param {Response} res
 */
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params

        const user = await User.findOne({ where: { UserID: id } })

        if (!user) {
            res.status(404).json({ field: 'general', message: 'User not found' })
            return
        }

        await user.update({ Active: false })

        res.status(200).json({ field: 'general', message: 'User deleted successfully' })
    } catch (error) {
        res.status(500).json({ field: 'general', message: 'Something went wrong!', error: error.message })
    }
}

/**
 * Reactivate a user
 * @param {Request} req
 * @param {Response} res
 */
const reactivateUser = async (req, res) => {
    try {
        const { id } = req.params

        const user = await User.findOne({ where: { UserID: id } })

        if (!user) {
            res.status(404).json({ field: 'general', message: 'User not found' })
            return
        }

        await user.update({ Active: true })

        res.status(200).json({ field: 'general', message: 'User reactivated successfully' })
    } catch (error) {
        res.status(500).json({ field: 'general', message: 'Something went wrong!', error: error.message })
    }
}

/**
 * Get a user's details including roles, volunteer events, and donation events
 * @param {Request} req
 * @param {Response} res
 */
const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params

        const user = await User.findOne({
            attributes: { exclude: ['Password']},
            where: { UserID: id },
            include: [
                {
                    model: UserRole,
                },
                {
                    model: Volunteer,
                    include: [
                        {
                            model: Event
                        }
                    ]
                },
                {
                    model: Donation,
                    include: [
                        {
                            model: Event
                        }
                    ]
                }
            ]
        })

        if (!user) {
            res.status(404).json({ field: 'general', message: 'User not found' })
            return
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ field: 'general', message: 'Something went wrong!', error: error.message })
    }
}

/**
 * Create a new user
 * @param {Request} req
 * @param {Response} res
 */
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

/**
 * Add new roles for a user
 * @param {Request} req
 * @param {Response} res
 */
const addUserRoles = async (req, res) => {
    const userID = req.userID
    const { roles } = req.body

    const user = await User.findOne({ where: { UserID: userID } })

    if (!user) {
        res.status(404).send({ field: 'general', message: "User not found" })
        return
    }

    const createdRoles = await createUserRoles(user, roles)
    if (!createdRoles) {
        res.status(500).send({ field: 'general', message: "Roles could not be added successfully" })
        return
    }
    const userRoles = await user.getUserRoles()
    res.status(200).json({ roles: userRoles, message: "User roles added successfully" })
}

/**
 * Add all the user roles to the user
 * @param {User} user
 * @param {Array} roles
 * @returns {Boolean}
 */
const createUserRoles = async (user, roles) => {
    await Promise.all(roles.map(async (role) => {
        const loggedInUser = await User.findOne({ where: { UserID: user.UserID } })
        if (loggedInUser === null) {
            console.log("User not found")
            return false
        }

        const userRole = await UserRole.findOne({ where: { DisplayName: role } })
        if (userRole === null) {
            console.log("Role not found")
            return false
        }

        if (await loggedInUser.hasUserRole(userRole)) {
            console.log(`User already has role: ${userRole.DisplayName}`)
        } else {
            await loggedInUser.addUserRole(userRole)
        }
    }))
    return true
}

/**
 * Express middleware to validate a new user
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
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

    if (!password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/g)) {
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

/**
 * Express middleware to validate a new user role
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
const validateNewUserRoles = async (req, res, next) => {
    const userID = req.userID
    const { roles } = req.body

    const user = await User.findOne({ where: { UserID: userID } })

    if (!user) {
        res.status(404).send({ field: 'general', message: "User not found" })
        return
    }

    const validUserRoles = await UserRole.findAll({
        where: {
            DisplayName: {
                [Op.in]: roles
            }
        }
    })

    if (validUserRoles.length !== roles.length) {
        res.status(400).send({ field: 'general', message: "One or more roles are invalid" })
        return
    }

    if (roles.includes('Administrator')) {
        res.status(403).json({ field: 'general', message: 'You do not have permission to assign admin roles' })
        return
    }

    next()
}

module.exports = { getUsers, deleteUser, reactivateUser, getUserDetails, createUser, addUserRoles, validateNewUser, validateNewUserRoles }