const express = require('express')
const { getUsers, deleteUser, reactivateUser, getUserDetails, addUserRoles, validateNewUserRoles } = require('../controllers/userController')
const { hasPermissions } = require('../controllers/authController')

const router = express.Router()

router.route('/')
    .get(hasPermissions(['Administrator']), getUsers)

router.route('/:id')
    .delete(hasPermissions(['Administrator']), deleteUser)
    .put(hasPermissions(['Administrator']), reactivateUser)
    .get(hasPermissions(['Administrator']), getUserDetails)

// No role-based permissions are needed, but this way the access token is validated and the userID injected
router.post('/role', hasPermissions([]), validateNewUserRoles, addUserRoles)

module.exports = router