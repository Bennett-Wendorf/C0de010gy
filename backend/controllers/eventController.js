const { Event } = require('../database/models')

const getAllEvents = async (req, res) => {
    const events = await Event.findAll()
    res.json({
        events
    })
}

const createEvent = async (req, res) => {
    const { summary, description, neededVolunteers, location, volunteerQualifications, startTime, endTime } = req.body

    // TODO: Add input validation here or in middleware

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
    res.sendStatus(200)
}

const deleteEvent = async (req, res) => {
    res.sendStatus(200)
}

const validateNewEvent = (req, res, next) => {
    if(!req.body.summary || req.body.summary.length == 0){
        res.status(400).json({ field: 'summary', message: 'Summary is required' })
        return
    } 

    if(!req.body.startTime){
        res.status(400).json({ field: 'startTime', message: 'Start time is required' })
        return
    }

    if(!req.body.endTime){
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

    if (startTime < currentTime) {
        res.status(400).json({ field: 'time', message: 'Start time must be in the future' })
        return
    }

    next()
}

module.exports = { getAllEvents, createEvent, updateEvent, deleteEvent, validateNewEvent }