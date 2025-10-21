const nodemailer = require("nodemailer");

// Transporter: email service configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

async function sendPasswordResetEmail(toEmail, resetUrl){
    if (process.env.NODE_ENV === 'development' || !process.env.EMAIL_USER) {
        console.log('='.repeat(60));
        console.log('📧 PASSWORD RESET EMAIL (NOT SENT - DEV MODE)');
        console.log('To:', toEmail);
        console.log('Reset URL:', resetUrl);
        console.log('Token:', resetUrl.split('token=')[1]);
        console.log('='.repeat(60));
        return;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'Password Reset Request',
        html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        `
    };

    await transporter.sendMail(mailOptions);
}

module.exports = {
    sendPasswordResetEmail
}