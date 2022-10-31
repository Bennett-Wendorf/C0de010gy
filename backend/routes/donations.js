const express = require('express')
const { getAllDonations, donateGeneral, validateNewDonation } = require('../controllers/donateController')
const { hasPermissions } = require('../controllers/authController')

const router = express.Router()

// Get all donations on get request
router.route('/')
    .get(hasPermissions([]), getAllDonations)
    .post(hasPermissions(['Donor']), validateNewDonation, donateGeneral)

module.exports = router