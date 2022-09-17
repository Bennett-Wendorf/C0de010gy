const express = require('express')
const { body, validationResult } = require('express-validator')

const passwordValidationRules = () => {
    return [body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')]
}

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    } else {
        return res.status(400).json({ errors: errors.array() })
    }
}

module.exports = { passwordValidationRules, validate }