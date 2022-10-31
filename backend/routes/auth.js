const express = require('express')
const { login, logout, getNewAccessToken } = require('../controllers/authController')
const { createUser, validateNewUser } = require('../controllers/userController')

const router = express.Router()

// TODO: Add additional registration middleware validation for things like email format
router.post('/register', validateNewUser, createUser)

router.post('/login', login)

router.post('/refresh', getNewAccessToken)

router.post('/logout', logout)

module.exports = router