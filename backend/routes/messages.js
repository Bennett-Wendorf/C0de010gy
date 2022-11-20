const express = require('express')
const { getMyMessages, markMessageAsRead, markMessageAsUnread, ensureMessageIsOwn } = require('../controllers/messageController')
const { hasPermissions } = require('../controllers/authController')

const router = express.Router()

router.route("/:id")
    .delete(hasPermissions([]), ensureMessageIsOwn, markMessageAsRead)
    .put(hasPermissions([]), ensureMessageIsOwn, markMessageAsUnread)

router.get('/me', hasPermissions([]), getMyMessages)

module.exports = router