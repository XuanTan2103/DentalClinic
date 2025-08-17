const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const authController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) return res.status(404).json({ message: 'User not found' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

            const token = jwt.sign(
                { userId: user._id, role: user.role, fullName: user.fullName },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );
            const { password: pwd, ...others } = user.toObject();
            return res.status(200).json({ user: others, token });

        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ message: 'Server error', error });
        }
    },
}

module.exports = authController;