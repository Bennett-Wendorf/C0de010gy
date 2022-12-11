const { Donation, Event } = require('../database')
const { Op } = require('sequelize')

/**
 * Donate to an event
 * @param {Request} req 
 * @param {Response} res 
 */
const donateToEvent = async (req, res) => {
    const { id } = req.params
    const userID = req.userID
    const { amount } = req.body

    try {
        const event = await Event.findOne({ where: { EventID: id } })
        if (!event) {
            return res.status(404).json({ field: 'general', message: 'Event not found' })
        }

        await Donation.create({
            UserID: userID,
            EventID: id,
            Amount: amount,
            UserIDCreatedBy: userID,
            UserIDLastModifiedBy: userID,
        })

        res.status(200).json({ field: 'general', message: `Successfully donated to event: ${event.Summary}` })
    }
    catch (err) {
        res.status(500).json({ field: 'general', message: 'Something went wrong', error: err })
    }
}

/**
 * Check if the current user has donated to the given event
 * @param {Request} req 
 * @param {Response} res 
 */
const hasDonated = async (req, res) => {
    const { id } = req.params
    const userID = req.userID

    try {
        const donation = await Donation.findOne({ where: { UserID: userID, EventID: id } })
        if (!donation) {
            return res.status(200).send(false)
        }

        res.status(200).send(true)
    }
    catch (err) {
        res.status(500).json({ field: 'general', message: 'Something went wrong' })
    }
}

/**
 * Get all donations for an event
 * @param {Request} req
 * @param {Response} res
 */
const getEventDonations = async (req, res) => {
    const { id } = req.params
    const userID = req.userID

    try {
        const donations = await Donation.findAll({ where: { EventID: id, UserID: userID } })

        res.status(200).json(donations)
    }
    catch (err) {
        res.status(500).json({ field: 'general', message: 'Something went wrong' })
    }
}

/**
 * Get all donations in a time range
 * @param {Request} req
 * @param {Response} res
 */
const getAllDonations = async (req, res) => {
    try {
        const { startDate, endDate } = req.query

        const donations = await Donation.findAll({
            where:
            {
                CreatedDateTime: {
                    [Op.between]: [startDate, endDate]
                }
            }
        })

        res.status(200).json(donations)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ field: 'general', message: 'Something went wrong', error: err })
    }
}

/**
 * Get all donations for the given user
 * @param {Request} req
 * @param {Response} res
 */
const getAllDonationsForUser = async (req, res) => {
    const userID = req.userID

    try {
        const donations = await Donation.findAll({ where: { UserID: userID }, include: Event })
        res.status(200).json(donations)
    }
    catch (err) {
        res.status(500).json({ field: 'general', message: 'Something went wrong' })
    }
}

/**
 * Donate to the general fund
 * @param {Request} req
 * @param {Response} res
 */
const donateGeneral = async (req, res) => {
    const userID = req.userID
    const { amount } = req.body

    try {
        await Donation.create({
            UserID: userID,
            Amount: amount,
            UserIDCreatedBy: userID,
            UserIDLastModifiedBy: userID,
        })

        res.status(200).json({ field: 'general', message: `Successfully donated $${amount}` })
    }
    catch (err) {
        res.status(500).json({ field: 'general', message: 'Something went wrong', error: err })
    }
}

/**
 * Express middleware  to validate a new donation
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
const validateNewDonation = async (req, res, next) => {
    const userID = req.userID
    const { amount } = req.body

    let numericAmount = parseFloat(amount)

    // Ensure the amount is a valid value
    if (isNaN(numericAmount)) {
        return res.status(400).json({ field: 'amount', message: 'Amount must be a number' })
    }

    // Ensure the amount is greater than 0
    if (numericAmount <= 0) {
        return res.status(400).json({ field: 'amount', message: 'Amount must be greater than 0' })
    }

    // Log if the amount is unreasonably high
    if (numericAmount > 1000000) {
        console.log(`User ${userID} is donating an unreasonably high amount of $${amount}`)
    }

    // Reject if the amount is too high for the database
    if (numericAmount > 9999999999) {
        return res.status(400).json({ field: 'amount', message: 'Amount is too high' })
    }

    req.body.amount = numericAmount

    next()
}

module.exports = { donateToEvent, hasDonated, getAllDonations, getEventDonations, getAllDonationsForUser, donateGeneral, validateNewDonation }