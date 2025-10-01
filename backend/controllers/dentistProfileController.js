const DentistProfile = require('../models/DentistProfile');
const User = require('../models/User');

const dentistProfileController = {
    createDentistProfile: async (req, res) => {
        try {
            const { dentistId, specialization, experienceYears, biography, education, awards } = req.body;

            const dentist = await User.findById(dentistId);
            if (!dentist) {
                return res.status(404).json({ message: 'Dentist not found' });
            }

            if (dentist.role !== 'Dentist') {
                return res.status(400).json({ message: 'User is not a dentist' });
            }

            const existingProfile = await DentistProfile.findOne({ dentistId });
            if (existingProfile) {
                return res.status(400).json({ message: 'Dentist profile already exists' });
            }

            const newProfile = new DentistProfile({
                dentistId,
                specialization,
                experienceYears,
                biography,
                education,
                awards
            });

            await newProfile.save();

            res.status(201).json({
                message: 'Dentist profile created successfully',
                profile: newProfile
            });
        } catch (error) {
            console.error('Error creating dentist profile:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getdentistProfileById: async (req, res) => {
        try {
            const { dentistId } = req.params;

            const profile = await DentistProfile.findOne({ dentistId })
                .populate({
                    path: 'dentistId',
                    model: User,
                    select: '-password -__v'
                });

            if (!profile) {
                return res.status(404).json({ message: 'Dentist profile not found' });
            }

            res.status(200).json({
                message: 'Dentist profile fetched successfully',
                profile
            });
        } catch (error) {
            console.error('Error fetching dentist profile:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}

module.exports = dentistProfileController;