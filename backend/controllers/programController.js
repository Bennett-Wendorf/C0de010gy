const { Program, Event } = require('../database')

/**
 * Get programs for the current event
 * @param {Request} req 
 * @param {Response} res 
 */
const getEventPrograms = async (req, res) => {
    const { id } = req.params

    try {
        const programs = await Program.findAll({ where: { EventID: id }})
        res.status(200).json(programs)
    }
    catch (err) {
        res.status(500).json({ field: 'general', message: 'Something went wrong' })
    }
}

/**
 * Create a new program
 * @param {Request} req
 * @param {Response} res
 */
const createProgram = async (req, res) => {
    const { id } = req.params
    const { summary, description } = req.body

    try {
        const event = await Event.findOne({ where: { EventID: id }})
        if (!event) {
            return res.status(404).json({ field: 'general', message: 'Event not found' })
        }

        const newProgram = await Program.create({
            EventID: id,
            Summary: summary,
            Description: description,
        })

        if (newProgram) {
            res.status(200).json({ field: 'general', message: `Successfully created program: ${summary}`, program: newProgram })
        } else {
            res.status(500).json({ field: 'general', message: 'Something went wrong' })
        }
    }
    catch (err) {
        res.status(500).json({ field: 'general', message: 'Something went wrong', error: err.message })
    }
}

/**
 * Update a program
 * @param {Request} req
 * @param {Response} res
 */
const updateProgram = async (req, res) => {
    const { eventID, programID } = req.params
    const { summary, description } = req.body

    try {
        const program = await Program.findOne({ where: { ProgramID: programID, EventID: eventID }})
        if (!program) {
            return res.status(404).json({ field: 'general', message: 'Program not found' })
        }

        await Program.update({
            Summary: summary,
            Description: description,
        }, { where: { ProgramID: programID }})

        const updatedProgram = await Program.findOne({ where: { ProgramID: programID }})

        if (updatedProgram) {
            res.status(200).json({ field: 'general', message: `Successfully updated program: ${summary}`, program: updatedProgram })
        } else {
            res.status(500).json({ field: 'general', message: 'Something went wrong' })
        }
    }
    catch (err) {
        res.status(500).json({ field: 'general', message: 'Something went wrong', error: err.message })
    }
}

/**
 * Delete a program
 * @param {Request} req
 * @param {Response} res
 */
const deleteProgram = async (req, res) => {
    const { eventID, programID } = req.params

    try {
        const program = await Program.findOne({ where: { ProgramID: programID, EventID: eventID }})
        if (!program) {
            return res.status(404).json({ field: 'general', message: 'Program not found' })
        }

        await Program.destroy({ where: { ProgramID: programID }})
        res.status(200).json({ field: 'general', message: `Successfully deleted program: ${program.Summary}` })
    }
    catch (err) {
        res.status(500).json({ field: 'general', message: 'Something went wrong', error: err.message })
    }
}


/**
 * Express middleware to validate a new program
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
const validateNewProgram = (req, res, next) => {
    const { summary, description } = req.body

    if (!summary) {
        return res.status(400).json({ field: 'summary', message: 'Summary is required' })
    }

    // TODO: Check lengths of these fields

    next()
}

module.exports = { getEventPrograms, createProgram, updateProgram, deleteProgram, validateNewProgram }