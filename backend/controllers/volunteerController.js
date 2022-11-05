const { Volunteer, Event } = require('../database')
const { Op } = require('sequelize')

const volunteer = async (req, res) => {
    const { id } = req.params
    const userID  = req.userID

    try {
        const event = await Event.findOne({ where: { EventID: id }})
        if (!event) {
            return res.status(404).json({ field: 'general', message: 'Event not found' })
        }

        await Volunteer.create({
            UserID: userID,
            EventID: id,
            StartTime: event.StartTime,
            EndTime: event.EndTime,
            UserIDCreatedBy: userID,
            UserIDLastModifiedBy: userID,
        })

        res.status(200).json({ field: 'general', message: `Successfully volunteered for event: ${event.Summary}` })
    }
    catch (err) {
        res.status(500).json({ field: 'general', message: 'Something went wrong' })
    }
}

const hasVolunteered = async (req, res) => {
    const { id } = req.params
    const userID  = req.userID

    try {
        const volunteer = await Volunteer.findOne({ where: { UserID: userID, EventID: id }})
        if (!volunteer) {
            return res.status(200).send(false)
        }

        res.status(200).send(true)
    }
    catch (err) {
        res.status(500).json({ field: 'general', message: 'Something went wrong' })
    }
}

const cancelVolunteer = async (req, res) => {
    const { id } = req.params
    const userID  = req.userID

    try {
        const volunteer = await Volunteer.findOne({ where: { UserID: userID, EventID: id }})
        if (!volunteer) {
            return res.status(404).json({ field: 'general', message: 'Volunteer not found' })
        }

        const event = await Event.findOne({ where: { EventID: id }})

        await volunteer.destroy()

        res.status(200).json({ field: 'general', message: `Successfully cancelled volunteer for event: ${event.Summary}` })
    }
    catch (err) {
        res.status(500).json({ field: 'general', message: 'Something went wrong' })
    }
}

const validateNewVolunteer = async (req, res, next) => {
    const { id } = req.params
    const userID  = req.userID

    // Check for duplicate volunteer entries
    const duplicateVolunteer = await Volunteer.findOne({ where: {UserID: userID, EventID: id }})
    if (duplicateVolunteer) {
        return res.status(400).json({ field: 'general', message: 'Already volunteered for this event' })
    }

    // Ensure the event exists
    const event = await Event.findOne({ where: { EventID: id }})
    if (!event) {
        return res.status(404).json({ field: 'general', message: 'Event not found' })
    }

    // Check for overlapping volunteer times
    const overlappingVolunteer = await Volunteer.findOne({ 
        where: {
            UserID: userID, 
            [Op.or]: [
                {StartTime: {
                    [Op.between]: [event.StartTime, event.EndTime]
                }},
                {EndTime: {
                    [Op.between]: [event.StartTime, event.EndTime]
                }}
            ]
        }
    })
    if (overlappingVolunteer) {
        const overlappingEvent = await Event.findOne({ where: { EventID: overlappingVolunteer.EventID }})
        return res.status(400).json({ field: 'general', message: `You are already volunteering at this time for another event titled: ${overlappingEvent.Summary}` })
    }

    // TODO: Update this with better sequelize integration
    // Ensure that there are open volunteer slots
    const volunteerCount = await Volunteer.count({ where: { EventID: id }})
    if (volunteerCount >= event.NeededVolunteers) {
        return res.status(400).json({ field: 'general', message: 'Event is not in need of more volunteers' })
    }

    next()
}

module.exports = { volunteer, hasVolunteered, cancelVolunteer, validateNewVolunteer }