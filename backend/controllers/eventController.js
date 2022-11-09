const { Event, Volunteer, Donation } = require('../database')
const { Op } = require('sequelize')

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

const updateEvent = async (req, res) => {
    const { id } = req.params
    const { summary, description, neededVolunteers, location, volunteerQualifications, startTime, endTime } = req.body

    try {
        const event = await Event.findOne({ where: { EventID: id }})
        if (!event) {
            return res.status(404).json({ field: 'general', message: 'Event not found' })
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

        if (updatedEvent) {
            res.status(200).json({ field: 'general', message: `Successfully updated event: ${summary}`, event: updatedEvent })
        } else {
            res.status(500).json({ field: 'general', message: 'Something went wrong', error: "Updated event can no longer be found!" })
        }
    } catch (err) {
        res.status(500).json({ field: 'general', message: 'Something went wrong', error: err.message })
    }
}

const deleteEvent = async (req, res) => {
    const { id } = req.params

    try {
        const event = await Event.findOne({ where: { EventID: id } })
        if (!event) {
            res.status(404).json({ field: 'general', message: 'Event not found' })
            return
        }

        await Event.update({Cancelled: true}, { where: { EventID: id } })
        res.status(200).send({ field: 'general', message: "Event cancelled successfully" })
    } catch (err) {
        res.status(500).json({ field: 'general', message: 'Something went wrong', error: err.message })
    }
}

const validateNewEvent = (req, res, next) => {
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

    let startTime = new Date(req.body.startTime)
    let endTime = new Date(req.body.endTime)
    let currentTime = new Date()

    if (startTime > endTime) {
        res.status(400).json({ field: 'time', message: 'Start time must be before end time' })
        return
    }

    next()
}

const validateFutureStartTime = async (req, res, next) => {
    let startTime = new Date(req.body.startTime)
    let currentTime = new Date()

    if (startTime < currentTime) {
        res.status(400).json({ field: 'time', message: 'Start time must be in the future' })
        return
    }

    next()
}

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