console.log("📧 sendEmail.js loaded");
console.log("EMAIL_SERVICE_USER exists:", !!process.env.EMAIL_SERVICE_USER);
console.log("EMAIL_SERVICE_PASS exists:", !!process.env.EMAIL_SERVICE_PASS);


const nodemailer = require("nodemailer")

//create transporteer
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_SERVICE_USER,
        pass: process.env.EMAIL_SERVICE_PASS,
    },
});

(async () => {
    try {
        console.log("Verifying transporter...");
        await transporter.verify();
        console.log("✅ Email Server Connected");
    } catch (err) {
        console.error("❌ Verify failed:", err);
    }
})();

// //check connection
// transporter.verify((error,success)=>{
//     if(error){
//         console.log("Failed to Connect with Email Service",error)
//     }
//     else{
//         console.log("Email Server Connected Successfully");
        
//     }
// })

const sendEmail = async ({ to, subject, text, html }) => {
    console.log("Sending email...");
    console.log("Recipient:", to);
    console.log("Subject:", subject);

    try {
        const info = await transporter.sendMail({
            from: `"Cally" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            text,
            html
        });

        console.log("Message Sent:", info.messageId);
    } catch (err) {
        console.log("Error Sending Message:", err);
    }
};

module.exports = sendEmail;
module.exports = sendEmail