import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

router.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Log received contact form submission
    console.log('Received contact form submission:', req.body); // Debugging

    // Validate input fields
    if (!name || !email || !message) {
        console.log('Validation error: Missing fields'); // Debugging
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // Correct usage
        port: parseInt(process.env.EMAIL_PORT, 10),
        secure: true, // Use true for port 465, false for port 587
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Email options
    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: `New Contact Form Message from ${name}`,
        text: message,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response); // Debugging
        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending contact form email:', error); // Debugging
        res.status(500).json({ error: 'Failed to send message' });
    }
});

export default router;
