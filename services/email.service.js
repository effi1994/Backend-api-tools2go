const settings = require('../config/settings');
const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: settings.userEmail,
                pass: settings.userPassword,
            },
        });
    }

    async sendVerifyCodeByEmail(email, message, subTitle) {
        try {
            await this.transporter.sendMail({
                from: `"From Tolls2Go" <${settings.userEmail}>`,
                to: email,
                subject: subTitle,
                html: message,
            });
        } catch (error) {
            // Retry connecting to the SMTP server if an ESOCKET error occurs
            if (error.code === 'ESOCKET') {
                console.log('ESOCKET error occurred. Retrying...');
                await this.connectToSmtpServer();
                await this.sendVerifyCodeByEmail(email, message, subTitle);
            } else {
                throw new Error('Failed to send email: ' + error.message);
            }
        }
    }

    async connectToSmtpServer() {
        try {
            await this.transporter.verify();
        } catch (error) {
            throw new Error('Failed to connect to SMTP server: ' + error.message);
        }
    }
}

module.exports = new EmailService();
