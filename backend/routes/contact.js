// routes/contact.js
import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

router.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER, // Your Gmail address
            pass: process.env.EMAIL_PASS  // Your Gmail password
        }
    });

    // Email options
    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER, // Your email address where you want to receive emails
        subject: `New Contact Form Message from ${name}`,
        text: message
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

export default router;
