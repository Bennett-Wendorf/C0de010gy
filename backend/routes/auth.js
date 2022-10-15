const express = require('express')
const { passwordValidationRules, validate } = require('../validator.js')
const { login, logout, getNewAccessToken } = require('../controllers/authController')
const { createUser } = require('../controllers/userController')

const router = express.Router()

// TODO: Add additional registration middleware validation for things like email format
router.post('/register', passwordValidationRules(), validate, createUser)

router.post('/login', login)

router.post('/refresh', getNewAccessToken)

router.post('/logout', logout)

module.exports = router