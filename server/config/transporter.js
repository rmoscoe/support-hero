const nodemailer = require("nodemailer");

async function createTransporter () {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    }, {
        from: "Support Hero <no-reply@supporthero.com>"
    });
   
    return transporter;
}

async function sendEmail (to, subject, html) {
    let transporter = await createTransporter();

    let info = await transporter.sendMail({
        to,
        subject,
        html
    });

    return info;
}

module.exports = {
    createTransporter,
    sendEmail
};