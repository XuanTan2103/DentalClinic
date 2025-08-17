const User = require('../models/User');
const bcrypt = require('bcrypt');
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
});


const userController = {
    register: async (req, res) => {
        try {
            const { email, fullName, phoneNumber, gender, dateOfBirth, address, avatar, role } = req.body;
            // Email đã được validate và normalize ở middleware, không cần kiểm tra lại

            const randomDigits = Math.floor(10000 + Math.random() * 90000);
            const base = fullName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');
            const generatedPassword = `${base}${randomDigits}`;

            const hashed = await bcrypt.hash(generatedPassword, 10);
            const newUser = new User({ email, fullName, phoneNumber, gender, dateOfBirth, address, avatar, role, password: hashed });
            await newUser.save();
            const mailOptions = {
                from: `"Gentle Care Dental" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Welcome to Our Service - Your Account Information',
                html: `
                    <div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f6f9; padding: 30px;">
                    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">

                        <!-- Header -->
                        <div style="background-color: #0077cc; color: white; padding: 40px 20px; text-align: center;">
                        <h2 style="margin: 0;">Welcome to Gentle Care Dental</h2>
                        </div>

                        <!-- Body -->
                        <div style="padding: 30px; color: #333;">
                        <p>Hi <strong>${fullName}</strong>,</p>
                        <p>Thank you for registering with Gentle Care Dental! Below are your login details:</p>

                        <table style="width: 100%; margin: 20px 0;">
                            <tr>
                            <td style="padding: 8px 0;"><strong>Email:</strong></td>
                            <td>${email}</td>
                            </tr>
                            <tr>
                            <td style="padding: 8px 0;"><strong>Password:</strong></td>
                            <td style="color: #d9534f;">${generatedPassword}</td>
                            </tr>
                        </table>

                        <p style="margin-top: 20px;">Please log in and change your password after your first login for security.</p>
                        </div>

                        <!-- Footer -->
                        <div style="background-color: #f0f0f0; color: #777; text-align: center; padding: 15px; font-size: 13px;">
                        &copy; 2025 Gentle Care Dental. All rights reserved.<br/>
                        Ha Noi, Viet Nam
                        </div>
                    </div>
                    </div>
                `
            };
            await transporter.sendMail(mailOptions);
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        } catch (err) {
            console.error("Registration error:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    },
}

module.exports = userController;