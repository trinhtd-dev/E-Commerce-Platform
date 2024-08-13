const nodemailer = require('nodemailer');

module.exports.sendMail =(email, subject, html) => {
    
    // Create a transporter object
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: process.env.MAIL_NAME, // Your Gmail address
        pass: process.env.MAIL_PASS,    // Your Gmail app password
        },
    });
    
    
    const mailOptions = {
        from: process.env.MAIL_NAME,           // Sender address
        to: email,            // Recipient address
        subject: subject,                // Subject line
        // text: `Your OTP code is ${otp}`,         // Plain text body
        html: html, // HTML body (optional)
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
        return console.log(error);
        }
        console.log('OTP sent: ' + info.response);
    });
    
};