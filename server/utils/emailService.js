import nodemailer from "nodemailer";

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Email body text
 */
export const sendEmail = async (to, subject, text) => {
    const email = process.env.EMAIL;
    const pass = process.env.EMAIL_PASS;

    if (!email || !pass) {
        const errorMsg = "❌ Nodemailer Error: EMAIL or EMAIL_PASS is missing in your .env file.";
        console.error(errorMsg);
        throw new Error(errorMsg);
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: email,
                pass: pass,
            },
        });

        const mailOptions = {
            from: `"ServiceHub Platform" <${email}>`,
            to,
            subject,
            text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully: ${info.response}`);
        return info;
    } catch (error) {
        console.error(`❌ Error sending email: ${error.message}`);
        if (error.code === 'EAUTH') {
            console.error("Authentication failed. Please check your EMAIL and EMAIL_PASS (App Password).");
        }
        throw error;
    }
};
