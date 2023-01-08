const express = require('express')
const { getMyMessages, toggleMessageRead, deleteMessage, ensureMessageIsOwn } = require('../controllers/messageController')
const { hasPermissions } = require('../controllers/authController')

const router = express.Router()

router.route("/:id")
    .delete(hasPermissions([]), ensureMessageIsOwn, deleteMessage)
    .put(hasPermissions([]), ensureMessageIsOwn, toggleMessageRead)

router.get('/me', hasPermissions([]), getMyMessages)

module.exports = router