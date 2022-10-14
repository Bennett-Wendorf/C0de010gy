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

module.exports = { getAllEvents, createEvent, updateEvent, deleteEvent }