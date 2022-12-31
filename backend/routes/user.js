const express = require('express')
const { getUsers, deleteUser, reactivateUser, updateUser, getUserDetails, getAllUserRoles, addUserRoles, validateNewUserRoles, validateUser } = require('../controllers/userController')
const { hasPermissions, hasPermissionsOrIsCurrentUser } = require('../controllers/authController')

const router = express.Router()

router.route('/')
    .get(hasPermissions(['Administrator']), getUsers)

// No role-based permissions are needed, but this way the access token is validated and the userID injected
router.post('/role', hasPermissions([]), validateNewUserRoles, addUserRoles)

router.get('/roles', getAllUserRoles)

router.route('/:id')
    .delete(hasPermissionsOrIsCurrentUser(['Administrator']), deleteUser)
    .put(hasPermissions(['Administrator']), reactivateUser)
    .post(hasPermissionsOrIsCurrentUser(['Administrator']), validateUser, validateNewUserRoles, updateUser)
    .get(hasPermissionsOrIsCurrentUser(['Administrator']), getUserDetails)

module.exports = router