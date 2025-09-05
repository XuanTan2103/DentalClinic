const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const authController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) return res.status(404).json({ message: 'Invalid email or password' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

            if (!user.isActive) {
                return res.status(403).json({ message: 'Account is inactive. Please contact the administrator.' });
            }

            const token = jwt.sign(
                { userId: user._id, role: user.role, fullName: user.fullName },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            if (user.firstLogin) {
                return res.status(200).json({
                    message: "You need to change your password before continuing.",
                    user: {
                        id: user._id,
                        role: user.role,
                        fullName: user.fullName,
                        firstLogin: user.firstLogin
                    },
                    token
                });
            }

            return res.status(200).json({
                user: {
                    id: user._id,
                    role: user.role,
                    fullName: user.fullName,
                    firstLogin: user.firstLogin
                },
                token
            });

        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ message: 'Server error', error });
        }
    },

    changePasswordFirstLogin: async (req, res) => {
        try {
            const userId = req.user.id
            const { newPassword, confirmNewPassword } = req.body;

            if (!newPassword || !confirmNewPassword) {
                return res.status(400).json({ message: 'Please enter your new password and confirm new password' });
            }

            if (newPassword !== confirmNewPassword) {
                return res.status(400).json({ message: 'Confirm new password does not match' });
            }

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

            if (!newPassword || !passwordRegex.test(newPassword)) {
                return res.status(400).json({
                    message: 'Password must be at least 8 characters, including lowercase letters, uppercase letters and numbers'
                });
            }

            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: 'User not found' });

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            user.firstLogin = false;
            await user.save();

            res.status(200).json({ message: 'Password changed successfully' });
        } catch (error) {
            console.error("Change password error:", error);
            res.status(500).json({ message: 'Server error', error });
        }
    },

    changePassword: async (req, res) => {
        try {
            const userId = req.user.id;
            const { currentPassword, newPassword, confirmNewPassword } = req.body;

            if (!currentPassword || !newPassword || !confirmNewPassword) {
                return res.status(400).json({ message: 'Please enter your current password, new password and confirm new password' });
            }

            if (newPassword !== confirmNewPassword) {
                return res.status(400).json({ message: 'Confirm new password does not match' });
            }

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(newPassword)) {
                return res.status(400).json({
                    message: 'New password must be at least 8 characters, including lowercase letters, uppercase letters and numbers'
                });
            }

            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: 'User not found' });

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Old password is incorrect' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();

            res.status(200).json({ message: 'Password changed successfully' });
        } catch (error) {
            console.error("Change password error:", error);
            res.status(500).json({ message: 'Server error', error });
        }
    }
}

module.exports = authController;