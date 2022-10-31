const express = require('express')
const { getAllEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController')
const { volunteer, hasVolunteered, cancelVolunteer, validateNewVolunteer } = require('../controllers/volunteerController')
const { donateToEvent, hasDonated, getEventDonations, validateNewDonation } = require('../controllers/donateController')
const { hasPermissions } = require('../controllers/authController')
const { validateNewEvent, ensureEventExists } = require('../controllers/eventController')

const router = express.Router()

// Get all event on get request or add a new task on post
router.route('/')
    .get(getAllEvents)
    .post(hasPermissions(['Administrator']), validateNewEvent, createEvent)

// Update the existing event with the specified id
router.put('/:id', hasPermissions(['Administrator']), updateEvent)

// Delete the event with the specified id
router.delete('/:id', hasPermissions(['Administrator']), deleteEvent)

// Volunteer for the event with the specified ID
router.route('/:id/volunteer')
    .post(hasPermissions(['Volunteer']), validateNewVolunteer, volunteer)
    .get(hasPermissions([]), hasVolunteered)
    .delete(hasPermissions(['Volunteer']), cancelVolunteer)

// Donate to the event with the specified ID
router.route('/:id/donate')
    .post(hasPermissions(['Donor']), ensureEventExists, validateNewDonation, donateToEvent)
    .get(hasPermissions([]), hasDonated)

router.get('/:id/donations', hasPermissions(['Donor']), getEventDonations)

module.exports = router