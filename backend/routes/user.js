const express = require('express')
const { getUsers, deleteUser, reactivateUser, getUserDetails, addUserRoles, validateNewUserRoles } = require('../controllers/userController')
const { hasPermissions, hasPermissionsOrIsCurrentUser } = require('../controllers/authController')

const router = express.Router()

router.route('/')
    .get(hasPermissions(['Administrator']), getUsers)

router.route('/:id')
    .delete(hasPermissionsOrIsCurrentUser(['Administrator']), deleteUser)
    .put(hasPermissions(['Administrator']), reactivateUser)
    .get(hasPermissionsOrIsCurrentUser(['Administrator']), getUserDetails)

// No role-based permissions are needed, but this way the access token is validated and the userID injected
router.post('/role', hasPermissions([]), validateNewUserRoles, addUserRoles)

module.exports = router