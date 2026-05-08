import nodemailer from "nodemailer";

export default async function handler(req, res) {
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASS;

    if (!gmailUser || !gmailPass) {
        return res.status(500).json({
            error: "Missing env vars",
            GMAIL_USER: gmailUser ? "✅ set" : "❌ missing",
            GMAIL_APP_PASS: gmailPass ? "✅ set" : "❌ missing",
        });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: gmailUser, pass: gmailPass },
        });

        await transporter.verify();

        await transporter.sendMail({
            from: `"RentX Test" <${gmailUser}>`,
            to: gmailUser, // send to yourself
            subject: "RentX Email Test ✅",
            text: "If you see this, Gmail SMTP is working correctly!",
        });

        return res.status(200).json({ success: true, message: `Test email sent to ${gmailUser}` });

    } catch (error) {
        return res.status(500).json({
            error: error.message,
            code: error.code,
        });
    }
}
