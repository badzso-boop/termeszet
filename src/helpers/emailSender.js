const nodemailer = require('nodemailer');

// Create a transporter object
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // e.g., smtp.gmail.com for Gmail
    port: 465, // or 587 if you're using TLS
    secure: true, // true for 465, false for 587
    auth: {
        user: 'norbi.rumli007@gmail.com', // your email
        pass: 'umwkvbwiegylnsso' // your email password or app-specific password
    }
});

exports.send = async (reciverEmail, subject, name, text) => {
    try {
        // Send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'Németh Gabriella <azegy1@gmail.com>', // sender address
            to: reciverEmail, // receiver's email
            subject: subject, // Subject line
            html: `<p>Hello ${name},</p><p>${text}</p>` // HTML body (optional)
        });

        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
