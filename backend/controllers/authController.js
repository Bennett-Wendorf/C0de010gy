const jwt = require('jsonwebtoken')
const jwtDecode = require('jwt-decode')
const { User } = require('../database/models')
const bcrypt = require('bcrypt')

let refreshTokens = []

const login = async (req, res) => {     
    let { username, password } = req.body

    // Get the user from the database, if it exists
    const user = await User.findOne({ where: { Username: username } })

    if (user === null){
        res.status(401).send({field: 'general', message: 'Username or password are not correct'})
        return
    }

    bcrypt.compare(password, user.Password, (err, result) => {
        if (err) {
            res.status(500).send({field: 'general', message: 'An unknown error occurred'})
        }
        if (result) {
            const accessToken = generateAccessToken(user)
            const refreshToken = generateRefreshToken(user)

            refreshToken[refreshToken] = user

            res.cookie("refreshToken", refreshToken, { secure: true, httpOnly: true , path: "/auth" })

            const response = {
                user: user.username,
                accessToken: accessToken,
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

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if (token === null) {
        return res.status(401).send("Invalid token")
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(401).send("Invalid token")
        }

        req.user = user
        next()
    })
}

const getNewAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken

    if (refreshToken === null) {
        return res.sendStatus(401)
    }

    if (refreshTokens[refreshToken] === null) {
        return res.sendStatus(401)
    }

    jwt.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.status(401).send("Invalid Token")
            return
        }

        const accessToken = generateAccessToken(user)
        res.json({ accessToken: accessToken })
    })
}

module.exports = { login, logout, verifyToken, getNewAccessToken }