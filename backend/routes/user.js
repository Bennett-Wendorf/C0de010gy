const express = require('express')
const { addUserRoles } = require('../controllers/userController')
const { hasPermissions } = require('../controllers/authController')

const router = express.Router()

// No role-based permissions are needed, but this way the access token is validated and the userID injected
router.post('/role', hasPermissions([]), addUserRoles)

module.exports = router