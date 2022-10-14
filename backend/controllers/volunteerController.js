const { Volunteer } = require('../database/models')
const { Event } = require('../database/models')

const volunteer = async (req, res) => {
    const { id } = req.params
    const userId  = req.userID

    console.log(req)

    try {
        const event = await Event.findOne({ where: { EventID: id }})
        if (!event) {
            return res.status(404).json({ field: 'general', message: 'Event not found' })
        }

        const volunteer = await Volunteer.findOne({ where: {UserID: userId, EventID: id }})
        if (volunteer) {
            return res.status(400).json({ field: 'general', message: 'Already volunteered for this event' })
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