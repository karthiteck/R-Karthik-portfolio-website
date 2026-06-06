const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5600;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL || EMAIL_USER;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname, { dotfiles: 'ignore' })); // Serves portfolio static files (index.html, styles.css, script.js)

// Contact API Endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Simple validation
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    if (!EMAIL_USER || !EMAIL_PASS) {
        return res.status(500).json({ error: 'Email service is not configured. Add EMAIL_USER and EMAIL_PASS to your .env file.' });
    }

    try {
        // Create Nodemailer Transporter using Gmail SMTP
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: EMAIL_USER, // Your Gmail address
                pass: EMAIL_PASS  // Your Gmail App Password
            }
        });

        // Email structure
        const mailOptions = {
            from: `"${name}" <${email}>`, // Sender's name and email
            to: process.env.RECEIVER_EMAIL || 'karthi.teck@gmail.com', // Where you want to receive emails
            subject: `New Portfolio Message from ${name}`,
            text: `You have received a new contact request from your portfolio website.\n\n` +
                  `Name: ${name}\n` +
                  `Email: ${email}\n\n` +
                  `Message:\n${message}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px;">
                    <h2 style="color: #7209b7; margin-bottom: 20px;">New Portfolio Message</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p><strong>Message:</strong></p>
                    <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</p>
                </div>
            `
        };

        // Send Email
        await transporter.sendMail(mailOptions);
        
        return res.status(200).json({ success: true, message: 'Message sent successfully.' });
    } catch (error) {
        console.error('Error sending email:', error);
        const message = error.code === 'EAUTH'
            ? 'Email authentication failed. Verify your Gmail address and App Password in .env.'
            : 'Failed to send message. Please try again later.';
        return res.status(500).json({ error: message });
    }
});

// Fallback to index.html for frontend routing
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
