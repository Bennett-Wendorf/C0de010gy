const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
const helmet = require('helmet')
const options = { cors: { origin: "*", }, }
const authRoute = require('./routes/auth')
const eventRoute = require('./routes/events')
const cookieParser = require('cookie-parser')

// Define the port to run the backend on as the environment variable for port, or 8080 if that variable is not defined
const PORT = process.env.PORT || 8080;

dotenv.config()

//Check if token secrets were provided
if (!process.env.ACCESS_TOKEN_SECRET) {
    console.error("Please Provide a Access Token Secret. See documentation for details.");
    process.exit();
} else if (!process.env.REFRESH_TOKEN_SECRET) {
    console.error("Please Provide a Refresh Token Secret. See documentation for details.");
    process.exit();
}

// Ensure the express app uses these modules
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(helmet({
    contentSecurityPolicy: false,
}))
app.use(cookieParser())

// Set up routes
app.use('/api/auth', authRoute)
app.use('/api/events', eventRoute)

// Error handlers
app.use((req, res) => res.status(404).send("404 NOT FOUND"))
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("Internal Server Error")
})

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
})