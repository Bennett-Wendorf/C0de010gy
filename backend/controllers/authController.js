const jwt = require('jsonwebtoken')
const { User } = require('../database/models')
const bcrypt = require('bcrypt')
const { getUserRoles } = require('./userController')

let refreshTokens = []

const login = async (req, res) => {     
    let { username, password } = req.body

    // Get the user from the database, if it exists
    const user = await User.findOne({ where: { Username: username } })

    if (user === null){
        res.status(401).send({field: 'general', message: 'Username or password are not correct'})
        return
    }

    const userRoles = await getUserRoles(user)

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

const generateAccessToken = (user) => {
    return jwt.sign(
        { username: user.Username, id: user.UserID },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_LIFE || "30m",
        }
    )
}

const generateRefreshToken = (user) => {
    return jwt.sign(
        { username: user.Username, id: user.UserID },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_LIFE || "14d",
        }
    )
}

const logout = async (req, res) => {
    refreshTokens = refreshTokens.filter((token) => token !== req.cookies.refreshToken)
    res.sendStatus(204)
}

// Check if the current user has a valid access token, and if so, also check if they have the allowed permissions
const hasPermissions = (allowedPermissions) => {
    return async (req, res, next) => {
        const errorString = "You do not have permission to perform this action"
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(":")[1]

        if (token == null) {
            return res.status(401).json({ field: 'general', message: errorString })
        }

        await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, usr) => {
            if (err) {
                return res.status(401).json({ field: 'general', message: errorString })
            }

            const user = await User.findOne({ where: { UserID: usr.id } })

            var userRoles = await getUserRoles(user)

            if (allowedPermissions.some(permission => userRoles.includes(permission))) {
                req.userID = usr.id
                next()
            } else {
                console.log("Permission denied")
                return res.status(401).json({ field: 'general', message: errorString })
            }
        })
    }
}

const getNewAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken

    if (refreshToken == null) return res.status(401).json({ error: "No token provided" })

    console.log(refreshTokens)

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

        const userRoles = await getUserRoles(user)

        const accessToken = generateAccessToken(user)
        res.json({ 
            accessToken: accessToken,
            roles: userRoles,
            fullName: user.FullName
        })
    })
}

module.exports = { login, logout, hasPermissions, getNewAccessToken }