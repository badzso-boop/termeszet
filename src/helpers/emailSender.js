const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter object
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // e.g., smtp.gmail.com for Gmail
    port: 465, // or 587 if you're using TLS
    secure: true, // true for 465, false for 587
    auth: {
        user: process.env.EMAIL_USER, // your email from .env
        pass: process.env.EMAIL_PASS // your password from .env
    }
});

exports.send = async (reciverEmail, subject, name, text) => {
    try {
        // Send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'Németh Gabriella <azegy1@gmail.com>', // sender address
            to: reciverEmail, // receiver's email
            subject: subject, // Subject line
            html: `<p>Hello ${name},</p> <p>${text}</p>` // HTML body (optional)
        });

        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
