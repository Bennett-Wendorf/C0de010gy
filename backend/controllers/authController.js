const jwt = require('jsonwebtoken')
const { User } = require('../database')
const bcrypt = require('bcrypt')

let refreshTokens = []

/**
 * Handle the login request and generate tokens as needed
 * @param {Request} req 
 * @param {Response} res 
 * @returns User's full name, roles, and an access token on success, or error message on failure
 */
const login = async (req, res) => {     
    let { username, password } = req.body

    // Get the user from the database, if it exists
    const user = await User.findOne({ where: { Username: username } })

    if (user === null){
        res.status(401).send({field: 'general', message: 'Username or password are not correct'})
        return
    }

    if (user.Active === false){
        res.status(401).send({field: 'general', message: 'User is not active. Please contact an admin if you think this is a mistake.'})
        return
    }

    const userRoles = await user.getUserRoles()

    // Compare the password to the hashed password in the database
    bcrypt.compare(password, user.Password, (err, result) => {
        if (err) {
            res.status(500).send({field: 'general', message: 'An unknown error occurred'})
        }
        if (result) {
            const accessToken = generateAccessToken(user)
            const refreshToken = generateRefreshToken(user)

            refreshTokens[refreshToken] = user

            res.cookie("refreshToken", refreshToken, { path: "/api/auth", httpOnly: true, secure: false })

            const response = {
                fullName: user.FullName,
                accessToken: accessToken,
                roles: userRoles
            };

            res.status(200).json(response)
        } else {
            res.status(401).send({field: 'general', message: 'Username or password are not correct'});
        }
    })
}

/**
 * Generate a jwt access token
 * @param {*} user 
 * @returns  jwt access token
 */
const generateAccessToken = (user) => {
    return jwt.sign(
        { username: user.Username, id: user.UserID },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_LIFE || "30m",
        }
    )
}

/**
 * Generate a jwt refresh token
 * @param {*} user 
 * @returns  jwt refresh token
 */
const generateRefreshToken = (user) => {
    return jwt.sign(
        { username: user.Username, id: user.UserID },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_LIFE || "14d",
        }
    )
}

/**
 * Log the user out and delete their refresh token
 * @param {Request} req 
 * @param {Response} res 
 */
const logout = async (req, res) => {
    refreshTokens = refreshTokens.filter((token) => token !== req.cookies.refreshToken)
    res.sendStatus(204)
}

/**
 * Express middleware to check if the current user has a valid access token, and if so, also check if they have the allowed permissions
 * @param {Array} allowedPermissions
 * @returns 401 if the user is not logged in, 403 if the user does not have the required permissions, or 200 if the user is logged in and has the required permissions
 */
const hasPermissions = (allowedPermissions) => {
    return async (req, res, next) => {
        const errorString = "You do not have permission to perform this action"
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(":")[1]

        if (token == null) {
            return res.status(401).json({ field: 'general', message: errorString, error: "No token provided" })
        }

        await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, usr) => {
            if (err) {
                return res.status(401).json({ field: 'general', message: errorString, error: "Invalid token" })
            }

            const user = await User.findOne({ where: { UserID: usr.id } })

            if (user === null){
                return res.status(401).json({ field: 'general', message: errorString, error: "No user found" })
            }

            var userRoles = await user.getUserRoles()

            // If no permissions are required, allow the user to continue
            if (allowedPermissions.length == 0) {
                req.userID = usr.id
                next()
                return
            }

            if (allowedPermissions.some(permission => userRoles.some(role => role.DisplayName === permission))) {
                req.userID = usr.id
                next()
            } else {
                return res.status(401).json({ field: 'general', message: errorString, error: "Bad permissions" })
            }
        })
    }
}

const currentUserIsAdmin = async (req) => {
    let toReturn = false
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(":")[1]

    if (token == null) {
        return false
    }

    await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, usr) => {
        if (err) {
            toReturn = false
            return
        }

        const user = await User.findOne({ where: { UserID: usr.id } })

        if (user === null){
            toReturn = false
            return
        }

        var userRoles = await user.getUserRoles()

        if (userRoles.some(role => role.DisplayName === "Administrator")) {
            toReturn = true
            return
        } else {
            toReturn = false
            return
        }
    })

    return toReturn
}

/** 
 * NOTE: This method expects that the request contains an id parameter corresponding to the user whose 
 * information is being requested or updated
 * @param {Array} allowedPermissions
 * @returns 401 if the user is not logged in, 403 if the user does not have the required permissions, or 200 if the user is logged in and has the required permissions
 */
const hasPermissionsOrIsCurrentUser = (allowedPermissions) => {
    return async (req, res, next) => {
        const errorString = "You do not have permission to perform this action"
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(":")[1]

        const { id } = req.params

        if (token == null) {
            return res.status(401).json({ field: 'general', message: errorString, error: "No token provided" })
        }

        await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, usr) => {
            if (err) {
                return res.status(401).json({ field: 'general', message: errorString, error: "Invalid token" })
            }

            const user = await User.findOne({ where: { UserID: usr.id } })

            if (user === null){
                return res.status(401).json({ field: 'general', message: errorString, error: "No user found" })
            }

            req.userID = usr.id

            if (usr.id == id) {
                next()
                return
            }

            var userRoles = await user.getUserRoles()

            // If no permissions are required, allow the user to continue
            if (allowedPermissions.length == 0) {
                next()
                return
            }

            if (allowedPermissions.some(permission => userRoles.some(role => role.DisplayName === permission))) {
                next()
            } else {
                return res.status(401).json({ field: 'general', message: errorString, error: "Bad permissions" })
            }
        })
    }
}

const isCurrentUser = (req, res, next) => {
    const errorString = "You do not have permission to perform this action"
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(":")[1]

    const { id } = req.params

    if (token == null) {
        return res.status(401).json({ field: 'general', message: errorString, error: "No token provided" })

    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, usr) => {
        if (err) {
            return res.status(401).json({ field: 'general', message: errorString, error: "Invalid token" })
        }

        const user = await User.findOne({ where: { UserID: usr.id } })

        if (user === null){
            return res.status(401).json({ field: 'general', message: errorString, error: "No user found" })
        }

        req.userID = usr.id

        if (usr.id == id) {
            next()
        } else {
            return res.status(401).json({ field: 'general', message: errorString })
        }
    })
}

const validateLoginInfo = async (req, res, next) => {
    const errorString = "Incorrect password"
    const { password } = req.body
    const { id } = req.params

    if (id == null || password == null) {
        return res.status(400).json({ field: 'password', message: errorString, error: "Missing UserID or password" })
    }

    const user = await User.findOne({ where: { UserID: id } })

    // Compare the password to the hashed password in the database
    bcrypt.compare(password, user.Password, (err, result) => {
        if (err) {
            res.status(500).send({field: 'general', message: 'An unknown error occurred', error: err})
        }
        if (result) {
            next()
        } else {
            return res.status(400).send({field: 'password', message: errorString});
        }
    })
}

/**
 * Get a new access token using a refresh token
 * @param {Request} req
 * @param {Response} res
 * @returns 401 if the refresh token is invalid, or 200 if the refresh token is valid
 */
const getNewAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken

    if (refreshToken == null) return res.status(401).json({ error: "No token provided" })

    if (refreshTokens[refreshToken] == null) return res.status(401).json({ error: "Invalid refresh token" })

    jwt.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET, async (err, usr) => {
        if (err) {
            res.status(401).send("Invalid Token")
            return
        }

        // TODO: Improve this by not triggering on every refresh token, only when page refreshes
        // Get the user from the database, if it exists
        const user = await User.findOne({ where: { UserID: usr.id } })

        if (user === null){
            res.status(401).send('No user found with this access token!')
            return
        }

        const userRoles = await user.getUserRoles()

        const accessToken = generateAccessToken(user)
        res.json({ 
            accessToken: accessToken,
            roles: userRoles,
            fullName: user.FullName
        })
    })
}

module.exports = { login, logout, hasPermissions, hasPermissionsOrIsCurrentUser, isCurrentUser, getNewAccessToken, currentUserIsAdmin, validateLoginInfo }