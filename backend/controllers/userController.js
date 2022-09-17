const { User } = require('../database/models')
const bcrypt = require('bcrypt')

const saltRounds = 10;

const createUser = async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body

    // TODO: Double check validation rules here, or add them to the validation middleware

    const user = await User.findOne({ where: { Username: username } })

    if (user) {
        res.status(409).send("A user with that username already exists")
    }

    bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
        if (err) {
            res.status(500).send("An unknown error occurred")
        }

        var currentTime = new Date()

        // TODO: Update userIDCreatedBy and UserIDLastModifiedBy
        const newUser = await User.create({ 
            FirstName: firstName, 
            LastName: lastName, 
            Username: username,
            Email: email,
            Password: hashedPassword,
            UserIDCreatedBy: 1,
            CreatedDateTime: currentTime,
            UserIDLastModifiedBy: 1,
            LastModifiedDateTime: currentTime 
        })

        if (newUser) {
            res.body = newUser
            res.status(201).send("New user created successfully")
        } else {
            res.sendStatus(500)
        }
    })
}

module.exports = { createUser }