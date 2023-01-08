const express = require('express')
const { login, logout, getNewAccessToken } = require('../controllers/authController')
const { createUser, validateUser, validateNewUser, validatePassword, validateNewUserRoles } = require('../controllers/userController')

const router = express.Router()

router.post('/register', validateUser, validateNewUser, validatePassword, validateNewUserRoles, createUser)

router.post('/login', login)

router.post('/refresh', getNewAccessToken)

router.post('/logout', logout)

module.exports = router