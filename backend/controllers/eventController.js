const { Event } = require('../database/models')

const getAllEvents = async (req, res) => {
    const events = await Event.findAll()
    res.status(200).json(events)
}

const createEvent = async (req, res) => {
    res.sendStatus(200)
}

const updateEvent = async (req, res) => {
    res.sendStatus(200)
}

const deleteEvent = async (req, res) => {
    res.sendStatus(200)
}

module.exports = { getAllEvents, createEvent, updateEvent, deleteEvent }