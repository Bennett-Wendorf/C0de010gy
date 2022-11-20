const { Message, User } = require('../database');

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

const addMessage = async (fromUserID, toUserID, messageTitle, messageContent) => {
    const newMessage = await Message.create({
        UserIDCreatedBy: fromUserID,
        UserIDSentTo: toUserID,
        Title: messageTitle,
        Content: messageContent
    })

    return newMessage
}

const markMessageAsRead = async (req, res) => {
    const messageID = req.params.id
    try {
        console.log("Marking message as read")
        await Message.update({
            Read: true,
            ReadDateTime: new Date()
        }, { where: { MessageID: messageID } })
        console.log("Marked message as read")

        res.json({ field: 'general', message: "Message marked as read" })
    } catch (err) {
        res.status(500).json({ field: 'general', message: "Error updating message.", error: err.message })
    }
}

const markMessageAsUnread = async (req, res) => {
    const messageID = req.params.id
    try {
        console.log("Marking message as unread")
        await Message.update({
            Read: false,
            ReadDateTime: null
        }, { where: { MessageID: messageID } })
        console.log("Marked message as unread")

        res.json({ field: 'general', message: "Message marked as unread" })
    } catch (err) {
        res.status(500).json({ field: 'general', message: "Error updating message.", error: err.message })
    }
}

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

module.exports = { getMyMessages, addMessage, markMessageAsRead, markMessageAsUnread, ensureMessageIsOwn }