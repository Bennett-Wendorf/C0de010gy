const express = require('express')
const app = express()
const cors = require('cors')
const helmet = require('helmet')
const options = {cors: {origin: "*",},}
const {Donation, Event, Program, User, UserRole, UserRoleAssigned, Volunteer} = require('./database/models')

// Define the port to run the backend on as the environment variable for port, or 8080 if that variable is not defined
const PORT = process.env.PORT || 8080; 

// Ensure the express app uses these modules
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(helmet({
    contentSecurityPolicy: false,
}))

// Error handlers
app.use((req, res) => res.status(404).send("404 NOT FOUND"))
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("Internal Server Error")
})

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
})