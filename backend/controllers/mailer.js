import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

export const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Nodemailer configuration error:', error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

export const sendEmail = async (to, subject, html) => {
    try {
        console.log('Sending email to:', to); // Debugging
        console.log('Email subject:', subject); // Debugging
        console.log('Email content:', html); // Debugging
        
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html,
        });

        console.log('Email sent:', info.response); // Debugging
    } catch (error) {
        console.error('Error sending email:', error); // Debugging
    }
};
