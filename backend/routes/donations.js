const express = require('express')
const { getAllDonations, getAllDonationsForUser, donateGeneral, validateNewDonation } = require('../controllers/donateController')
const { hasPermissions } = require('../controllers/authController')

const router = express.Router()

// Get all donations on get request
router.route('/')
    .get(hasPermissions(['Administrator', 'Demo User']), getAllDonations)
    .post(hasPermissions(['Donor']), validateNewDonation, donateGeneral)

router.get('/me', hasPermissions([]), getAllDonationsForUser)

module.exports = router