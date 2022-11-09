const express = require('express')
const { getAllEvents, getAllFutureEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController')
const { volunteer, hasVolunteered, cancelVolunteer, validateNewVolunteer } = require('../controllers/volunteerController')
const { donateToEvent, hasDonated, getEventDonations, validateNewDonation } = require('../controllers/donateController')
const { hasPermissions } = require('../controllers/authController')
const { validateNewEvent, validateFutureStartTime, ensureEventExists } = require('../controllers/eventController')
const { getEventPrograms, createProgram, updateProgram, deleteProgram, validateNewProgram } = require('../controllers/programController')

const router = express.Router()

// Get all event on get request or add a new task on post
router.route('/')
    .get(getAllEvents)
    .post(hasPermissions(['Administrator']), validateNewEvent, validateFutureStartTime, createEvent)

router.get('/future' , getAllFutureEvents)

// Update the existing event with the specified id
router.put('/:id', hasPermissions(['Administrator']), validateNewEvent, updateEvent)

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

router.route('/:id/programs')
        .get(getEventPrograms)
        .post(hasPermissions(['Administrator']), validateNewProgram, createProgram)
        
router.route('/:eventID/programs/:programID')
    .put(hasPermissions(['Administrator']), validateNewProgram, updateProgram)
    .delete(hasPermissions(['Administrator']), deleteProgram)

module.exports = router