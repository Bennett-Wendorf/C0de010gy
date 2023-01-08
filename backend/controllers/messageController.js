const { Message, User } = require('../database');

/**
 * Get all the messages for the current user
 * @param {Request} req 
 * @param {Response} res 
 */
const getMyMessages = async (req, res) => {
    const userID = req.userID
    const messages = await Message.findAll({
        where: {
            UserIDSentTo: userID
        },
        order: [
            ['CreatedDateTime', 'DESC']
        ],
        include: [
            {
                model: User,
            }
        ]
    })
    res.json({
        messages
    })
}

/**
 * Add a new message
 * @param {Number} fromUserID
 * @param {Number} toUserID
 * @param {String} messageTitle
 * @param {String} messageContent
 * @returns {Message} The new message
 */
const addMessage = async (fromUserID, toUserID, messageTitle, messageContent) => {
    const newMessage = await Message.create({
        UserIDCreatedBy: fromUserID,
        UserIDSentTo: toUserID,
        Title: messageTitle,
        Content: messageContent
    })

    return newMessage
}

/**
 * Mark a message as read or unread
 * @param {Request} req
 * @param {Response} res
 */
const toggleMessageRead = async (req, res) => {
    const messageID = req.params.id
    try {
        const message = await Message.findOne({ where: { MessageID: messageID } })

        if (!message) {
            return res.status(404).json({field: 'general', message: "Message not found"})
        }

        message.Read = !message.Read

        await message.save()

        res.json({ field: 'general', message: `Message marked as ${message.Read ? 'read' : 'unread'}` })
    } catch (err) {
        res.status(500).json({ field: 'general', message: "Error updating message.", error: err.message })
    }
}

/**
 * Delete a message
 * @param {Request} req
 * @param {Response} res
 */
const deleteMessage = async (req, res) => {
    const messageID = req.params.id
    try {
        const message = await Message.findOne({ where: { MessageID: messageID } })

        if (!message) {
            return res.status(404).json({field: 'general', message: "Message not found"})
        }

        await message.destroy()

        res.json({ field: 'general', message: "Message deleted" })
    } catch (err) {
        res.status(500).json({ field: 'general', message: "Error deleting message.", error: err.message })
    }
}

/**
 * Express middleware to ensure the message belongs to the current user
 * @param {Request} req
 * @param {Response} res
 */
const ensureMessageIsOwn = async (req, res, next) => {
    const messageID = req.params.id
    const userID = req.userID

    const message = await Message.findOne({ where: { MessageID: messageID } })

    if (!message) {
        res.status(404).json({ field: 'general', message: 'Message not found' })
        return
    }

    if (message.UserIDSentTo !== userID) {
        res.status(403).json({ field: 'general', message: 'You cannot update messages you are not the recipient of' })
        return
    }

    next()
}

module.exports = { getMyMessages, addMessage, toggleMessageRead, deleteMessage, ensureMessageIsOwn }