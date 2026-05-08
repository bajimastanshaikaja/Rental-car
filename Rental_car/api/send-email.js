import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || process.env.VITE_MAIL_API);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const {
            email,
            customerName,
            bookingId,
            carName,
            carBrand,
            carType,
            pickupDate,
            returnDate,
            amount,
        } = req.body;

        const data = await resend.emails.send({
            from: "RentX <onboarding@resend.dev>",
            to: email,
            subject: `Trip Completed — ${carName} | RentX`,
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Trip Completed</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1d4ed8,#2563eb);padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">
                Rent<span style="color:#fb923c;font-style:italic;">X</span>
              </h1>
              <p style="margin:8px 0 0;color:#bfdbfe;font-size:14px;">Your trusted car rental partner</p>
            </td>
          </tr>

          <!-- Success Banner -->
          <tr>
            <td style="background:#f0fdf4;padding:24px 40px;text-align:center;border-bottom:1px solid #dcfce7;">
              <div style="display:inline-block;background:#22c55e;border-radius:50%;width:52px;height:52px;line-height:52px;text-align:center;font-size:26px;margin-bottom:12px;">✓</div>
              <h2 style="margin:0;color:#15803d;font-size:20px;font-weight:700;">Trip Completed Successfully!</h2>
              <p style="margin:6px 0 0;color:#4ade80;font-size:14px;">Thank you for riding with RentX</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:32px 40px 0;">
              <p style="margin:0;color:#374151;font-size:16px;">Hi <strong>${customerName}</strong>,</p>
              <p style="margin:12px 0 0;color:#6b7280;font-size:15px;line-height:1.6;">
                Your trip has been marked as completed. We hope you had a great experience!
                Here's a summary of your booking.
              </p>
            </td>
          </tr>

          <!-- Booking Details Card -->
          <tr>
            <td style="padding:24px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
                <tr>
                  <td style="padding:16px 20px;background:#1e40af;">
                    <p style="margin:0;color:#bfdbfe;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Booking Summary</p>
                    <p style="margin:4px 0 0;color:#ffffff;font-size:16px;font-weight:700;">${bookingId}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
                          <span style="color:#9ca3af;font-size:13px;">Car</span><br/>
                          <strong style="color:#111827;font-size:15px;">${carName}</strong>
                          <span style="color:#6b7280;font-size:13px;"> &bull; ${carBrand} &bull; ${carType}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td width="50%">
                                <span style="color:#9ca3af;font-size:13px;">Pickup Date</span><br/>
                                <strong style="color:#111827;font-size:14px;">${pickupDate}</strong>
                              </td>
                              <td width="50%">
                                <span style="color:#9ca3af;font-size:13px;">Return Date</span><br/>
                                <strong style="color:#111827;font-size:14px;">${returnDate}</strong>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0 0;">
                          <span style="color:#9ca3af;font-size:13px;">Total Amount Paid</span><br/>
                          <strong style="color:#1d4ed8;font-size:22px;">₹${amount}</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Rate CTA -->
          <tr>
            <td style="padding:0 40px 32px;text-align:center;">
              <p style="margin:0 0 16px;color:#6b7280;font-size:14px;">How was your experience? Your feedback helps us improve.</p>
              <a href="https://rentx.vercel.app/mybookings"
                style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:600;">
                ⭐ Rate Your Ride
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:13px;">
                This email was sent by <strong style="color:#374151;">RentX</strong> because you completed a booking.<br/>
                © ${new Date().getFullYear()} RentX. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
            `,
        });

        return res.status(200).json({ success: true, data });

    } catch (error) {
        console.error("Email send error:", error);
        return res.status(500).json({ error: error.message });
    }
}
