const express = require('express')
const { getAllEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController')

const router = express.Router()

// Get all tasks on get request or add a new task on post
router.route('/')
    .get(getAllEvents)
    .post(createEvent)

// Update the existing task with the specified id
router.put('/:id', updateEvent)

// Delete the task with the specified id
router.delete('/delete/:id', deleteEvent)

module.exports = router