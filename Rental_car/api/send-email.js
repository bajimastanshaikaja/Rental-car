import { Resend } from "resend";
 
const resend = new Resend(process.env.VITE_MAIL_API);
 
export default async function handler(req, res) {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "test@example.com",
      subject: "Hello",
      html: "<h1>Email Sent</h1>",
    });
 
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
}