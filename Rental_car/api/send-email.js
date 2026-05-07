import { Resend } from "resend";

const resend = new Resend(process.env.VITE_MAIL_API);

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        const {
            email,
            customerName,
            bookingId,
            carName,
            amount
        } = req.body;

        const data = await resend.emails.send({

            from: "onboarding@resend.dev",

            to: email,

            subject: "Ride Completed Successfully 🚗",

            html: `
                <h2>Hello ${customerName}</h2>

                <p>Your ride has been completed successfully.</p>

                <h3>Booking Details</h3>

                <p><strong>Booking ID:</strong> ${bookingId}</p>
                <p><strong>Car:</strong> ${carName}</p>
                <p><strong>Amount:</strong> ₹${amount}</p>

                <br/>

                <p>Please give your valuable rating ⭐</p>
            `,
        });

        return res.status(200).json(data);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: error.message
        });
    }
}