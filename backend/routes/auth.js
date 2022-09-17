const express = require('express')
const { passwordValidationRules, validate } = require('../validator.js')
const { login, logout, verifyToken, getNewAccessToken } = require('../controllers/authController')
const { createUser } = require('../controllers/userController')

const router = express.Router()

router.post('/register', passwordValidationRules(), validate, createUser)

router.post('/login', login)

router.get('/refresh', getNewAccessToken)

router.get('/logout', logout)

module.exports = router