const { Volunteer } = require('../database/models')
const { Event } = require('../database/models')
const { Op } = require('sequelize')

const volunteer = async (req, res) => {
    const { id } = req.params
    const userId  = req.userID

    try {
        const event = await Event.findOne({ where: { EventID: id }})
        if (!event) {
            return res.status(404).json({ field: 'general', message: 'Event not found' })
        }

        const duplicateVolunteer = await Volunteer.findOne({ where: {UserID: userId, EventID: id }})
        if (duplicateVolunteer) {
            return res.status(400).json({ field: 'general', message: 'Already volunteered for this event' })
        }

        const overlappingVolunteer = await Volunteer.findOne({ 
            where: {
                UserID: userId, 
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

        await Volunteer.create({
            UserID: userId,
            EventID: id,
            StartTime: event.StartTime,
            EndTime: event.EndTime,
            UserIDCreatedBy: userId,
            UserIDLastModifiedBy: userId,
        })

        res.status(200).json({ field: 'general', message: `Successfully volunteered for event: ${event.Summary}` })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ field: 'general', message: 'Something went wrong' })
    }
}

module.exports = { volunteer }