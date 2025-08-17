const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const validateLogin = [
    body('email')
        .notEmpty().withMessage('Email cannot be blank')
        .isEmail().withMessage('Invalid email'),

    body('password')
        .notEmpty().withMessage('Password cannot be blank'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateRegister = [
    body('email')
        .notEmpty().withMessage('Email cannot be blank')
        .isEmail().withMessage('Invalid email')
        .normalizeEmail()
        .custom(async (value) => {
            const existingUser = await User.findOne({ email: value.toLowerCase() });
            if (existingUser) {
                throw new Error('Email already exists');
            }
            return true;
        }),

    body('fullName')
        .notEmpty().withMessage('Full name cannot be blank')
        .isLength({ min: 2, max: 50 }).withMessage('Full name must be between 2 and 50 characters')
        .matches(/^[a-zA-ZÀ-ỹ\s]+$/).withMessage('Full name can only contain letters and spaces')
        .custom((value) => {
            if (value.trim().length === 0) {
                throw new Error('Full name cannot be empty');
            }
            return true;
        }),

    body('phoneNumber')
        .notEmpty().withMessage('Phone number cannot be blank')
        .matches(/^0[0-9]{9}$/).withMessage('Phone number must start with 0 and have 10 digits'),

    body('gender')
        .notEmpty().withMessage('Gender cannot be blank')
        .isIn(['male', 'female', 'other']).withMessage('Invalid gender'),

    body('dateOfBirth')
        .notEmpty().withMessage('Date of birth cannot be blank')
        .isISO8601().withMessage('Invalid date of birth')
        .custom((value) => {
            const birthDate = new Date(value);
            const today = new Date();
            if (birthDate > today) {
                throw new Error('Date of birth cannot be in the future');
            }
            return true;
        }),

    body('address')
        .notEmpty().withMessage('Address cannot be blank')
        .isLength({ min: 5, max: 255 }).withMessage('Address must be between 5 and 255 characters')
        .matches(/^[a-zA-Z0-9À-ỹ\s,.-]+$/).withMessage('Address can only contain letters, numbers, spaces, commas, periods, and hyphens')
        .custom((value) => {
            if (value.trim().length === 0) {
                throw new Error('Address cannot be empty');
            }
            return true;
        }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {validateLogin, validateRegister};