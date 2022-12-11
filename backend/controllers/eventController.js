const { Event, Volunteer, Donation } = require('../database')
const { Op } = require('sequelize')
const { notifyAllEventVolunteers, removeAllEventVolunteers } = require('./volunteerController')

/**
 * Get all events
 * @param {Request} req 
 * @param {Response} res 
 */
const getAllEvents = async (req, res) => {
    const events = await Event.findAll({
        where: {
            Cancelled: false
        },
        order: [
            ['StartTime', 'ASC']
        ],
        include: [
            {
                model: Volunteer,
            },
            {
                model: Donation,
            }
        ]
    })
    res.json({
        events
    })
}

/**
 * Get all events that have not started yet
 * @param {Request} req
 * @param {Response} res
 */
const getAllFutureEvents = async (req, res) => {
    const events = await Event.findAll({
        where: {
            StartTime: {
                [Op.gt]: new Date()
            },
            Cancelled: false
        },
        order: [
            ['StartTime', 'ASC']
        ],
        include: [
            {
                model: Volunteer,
            },
            {
                model: Donation,
            }
        ]
    })
    res.json({
        events
    })
}

/**
 * Create a new event
 * @param {Request} req
 * @param {Response} res
 */
const createEvent = async (req, res) => {
    const { summary, description, neededVolunteers, location, volunteerQualifications, startTime, endTime } = req.body

    const newEvent = await Event.create({
        Summary: summary,
        Description: description,
        NeededVolunteers: neededVolunteers,
        Location: location,
        VolunteerQualifications: volunteerQualifications,
        StartTime: startTime,
        EndTime: endTime,
        UserIDCreatedBy: req.userID,
        UserIDLastModifiedBy: req.userID,
    })

    if (newEvent) {
        res.status(201).send("New event created successfully")
    } else {
        res.status(500).json({ field: 'general', message: "An unknown error occurred" })
    }
}

/**
 * Update an event
 * @param {Request} req
 * @param {Response} res
 */
const updateEvent = async (req, res) => {
    console.log("Updating event")
    const { id } = req.params
    const { summary, description, neededVolunteers, location, volunteerQualifications, startTime, endTime } = req.body

    try {
        const event = await Event.findOne({ 
            where: { EventID: id },
            include: [
                {
                    model: Volunteer,
                },
            ]
        })
        if (!event) {
            return res.status(404).json({ field: 'general', message: 'Event not found' })
        }

        if (neededVolunteers < event.Volunteers.length) {
            return res.status(400).json({ field: 'general', message: 'Cannot reduce number of volunteers below number of volunteers already signed up' })
        }

        await Event.update({
            Summary: summary,
            Description: description,
            NeededVolunteers: neededVolunteers,
            Location: location,
            VolunteerQualifications: volunteerQualifications,
            StartTime: startTime,
            EndTime: endTime,
            UserIDLastModifiedBy: req.userID,
        }, { where: { EventID: id }})

        const updatedEvent = await Event.findOne({ where: { EventID: id }})

        notifyAllEventVolunteers(id, req.userID, "Event Updated", `The event titled "${event.Summary}" that you signed up for has been updated. Please check for conflicts`)

        if (updatedEvent) {
            res.status(200).json({ field: 'general', message: `Successfully updated event: ${summary}`, event: updatedEvent })
        } else {
            res.status(500).json({ field: 'general', message: 'Something went wrong', error: "Updated event can no longer be found!" })
        }
    } catch (err) {
        res.status(500).json({ field: 'general', message: 'Something went wrong', error: err.message })
    }
}

/**
 * Delete an event
 * @param {Request} req
 * @param {Response} res
 */
const deleteEvent = async (req, res) => {
    const { id } = req.params
    const userID = req.userID

    try {
        const event = await Event.findOne({ where: { EventID: id } })
        if (!event) {
            res.status(404).json({ field: 'general', message: 'Event not found' })
            return
        }

        await Event.update({Cancelled: true}, { where: { EventID: id } })

        notifyAllEventVolunteers(id, userID, "Event Cancelled", `The event titled "${event.Summary}" that you signed up for has been cancelled`)
        
        const removed = removeAllEventVolunteers(id)
        if (!removed) {
            res.status(500).json({ field: 'general', message: 'Something went wrong', error: "Unable to remove all volunteers from event" })
            return
        }
        
        res.status(200).send({ field: 'general', message: "Event cancelled successfully" })
    } catch (err) {
        res.status(500).json({ field: 'general', message: 'Something went wrong', error: err.message })
    }
}

/**
 * Express middleware to validate new event
 * @param {Request} req
 * @param {Response} res
 */
const validateNewEvent = (req, res, next) => {
    console.log("Validating new event")
    if (!req.body.summary || req.body.summary.length == 0) {
        res.status(400).json({ field: 'summary', message: 'Summary is required' })
        return
    }

    if (!req.body.startTime) {
        res.status(400).json({ field: 'startTime', message: 'Start time is required' })
        return
    }

    if (!req.body.endTime) {
        res.status(400).json({ field: 'endTime', message: 'End time is required' })
        return
    }

    if (req.body.neededVolunteers && req.body.neededVolunteers < 0) {
        res.status(400).json({ field: 'neededVolunteers', message: 'Number of volunteers cannot be negative' })
        return
    }

    let startTime = new Date(req.body.startTime)
    let endTime = new Date(req.body.endTime)
    let currentTime = new Date()

    if (startTime > endTime) {
        res.status(400).json({ field: 'time', message: 'Start time must be before end time' })
        return
    }

    next()
}

/**
 * Express middleware to validate future start time
 * @param {Request} req
 * @param {Response} res
 */
const validateFutureStartTime = async (req, res, next) => {
    let startTime = new Date(req.body.startTime)
    let currentTime = new Date()

    if (startTime < currentTime) {
        res.status(400).json({ field: 'time', message: 'Start time must be in the future' })
        return
    }

    next()
}

/**
 * Express middleware to ensure event exists
 * @param {Request} req
 * @param {Response} res
 */
const ensureEventExists = async (req, res, next) => {
    const { id } = req.params

    const event = await Event.findOne({ where: { EventID: id } })
    if (!event) {
        res.status(404).json({ field: 'general', message: 'Event not found' })
        return
    }

    next()
}

module.exports = { getAllEvents, getAllFutureEvents, createEvent, updateEvent, deleteEvent, validateNewEvent, validateFutureStartTime, ensureEventExists }