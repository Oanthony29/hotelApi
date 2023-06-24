const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({path: "../Config/config.env"});

const emailSender = async(options)=>{
    const transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth: {
            user: process.env.USER,
            pass: process.env.EMAILPASSWORD,
            secure: false
        }
    });

    const mailOptions = {
        from:process.env.USER,
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    await transporter.sendMail(mailOptions);
};

module.exports = emailSender