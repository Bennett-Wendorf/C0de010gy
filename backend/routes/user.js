const express = require('express')
const { getUsers, deleteUser, addUserRoles, validateNewUserRoles } = require('../controllers/userController')
const { hasPermissions } = require('../controllers/authController')

const router = express.Router()

router.route('/')
    .get(hasPermissions(['Administrator']), getUsers)
    
router.delete('/:id', hasPermissions(['Administrator']), deleteUser)

// No role-based permissions are needed, but this way the access token is validated and the userID injected
router.post('/role', hasPermissions([]), validateNewUserRoles, addUserRoles)

module.exports = router