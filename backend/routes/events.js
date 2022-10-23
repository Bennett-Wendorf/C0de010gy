const express = require('express')
const { getAllEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController')
const { volunteer } = require('../controllers/volunteerController')
const { hasPermissions } = require('../controllers/authController')
const { validateNewEvent } = require('../controllers/eventController')

const router = express.Router()

// Get all event on get request or add a new task on post
router.route('/')
    .get(getAllEvents)
    .post(hasPermissions(['Administrator']), validateNewEvent, createEvent)

// Update the existing event with the specified id
router.put('/:id', hasPermissions(['Administrator']), updateEvent)

// Delete the event with the specified id
router.delete('/delete/:id', hasPermissions(['Administrator']), deleteEvent)

// Volunteer for the event with the specified ID
router.post('/:id/volunteer', hasPermissions(['Volunteer']), volunteer)

module.exports = router