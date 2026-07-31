function generateOTP(){
    return Math.floor(100000 + Math.random() * 900000).toString()
}

function otpTemplate(otp){
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Email Verification</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">

    <table align="center" width="500" cellpadding="0" cellspacing="0"
        style="background: white; border-radius: 10px; padding: 30px;">

        <tr>
            <td align="center">
                <h2 style="color: #333;">Email Verification</h2>
            </td>
        </tr>

        <tr>
            <td>
                <p>Hello,</p>

                <p>
                    Thank you for registering. Please use the following
                    One-Time Password (OTP) to verify your email address:
                </p>

                <div
                    style="
                        background: #f0f4ff;
                        padding: 15px;
                        text-align: center;
                        font-size: 32px;
                        font-weight: bold;
                        letter-spacing: 8px;
                        border-radius: 8px;
                        margin: 20px 0;
                    ">
                    ${otp}
                </div>

                <p>
                    This OTP will expire in <strong>5 minutes</strong>.
                </p>

                <p>
                    If you did not request this verification, please ignore this email.
                </p>

                <br>

                <p>
                    Regards,<br>
                    Calendly
                </p>
            </td>
        </tr>

    </table>

</body>
</html>`
}

function generateRandomWords(length){
    const alphabets = "abcdefghijklmnopqrstuvwxyz"
    let random = ""
    for(let i=0;i<length;i++){
        random += alphabets[Math.floor(Math.random()*alphabets.length)]
    }
    return random
}

function convertToMinutes(time) {
   const [hour, minute] = time.split(":").map(Number);
   return hour * 60 + minute;
}


function bookingConfirmationTemplate({
    guestName,
    hostName,
    eventTitle,
    date,
    startTime,
    endTime,
    meetLink,
}) {
    return `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8" />
<title>Booking Confirmed</title>
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.08);">

<!-- Header -->
<tr>
<td align="center"
style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:40px;">

<div
style="width:70px;height:70px;background:white;border-radius:50%;line-height:70px;font-size:34px;">
🎉
</div>

<h1 style="color:white;margin:20px 0 10px;font-size:28px;">
Booking Confirmed
</h1>

<p style="color:#e5e7eb;font-size:16px;margin:0;">
Your meeting has been successfully scheduled.
</p>

</td>
</tr>

<!-- Greeting -->
<tr>
<td style="padding:40px;">

<p style="font-size:17px;color:#111827;margin-top:0;">
Hi <strong>${guestName}</strong>,
</p>

<p style="font-size:15px;color:#6b7280;line-height:1.7;">
Your booking has been confirmed. Below are your meeting details.
Please keep this email for future reference.
</p>

<!-- Meeting Card -->

<table width="100%"
style="margin:30px 0;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px;">

<tr>
<td style="padding:10px 0;color:#6b7280;">Meeting</td>
<td align="right" style="font-weight:bold;color:#111827;">
${eventTitle}
</td>
</tr>

<tr>
<td style="padding:10px 0;color:#6b7280;">Host</td>
<td align="right" style="font-weight:bold;color:#111827;">
${hostName}
</td>
</tr>

<tr>
<td style="padding:10px 0;color:#6b7280;">Date</td>
<td align="right" style="font-weight:bold;color:#111827;">
${date}
</td>
</tr>

<tr>
<td style="padding:10px 0;color:#6b7280;">Time</td>
<td align="right" style="font-weight:bold;color:#111827;">
${startTime} - ${endTime}
</td>
</tr>

</table>

<!-- Button -->

<div style="text-align:center;margin:40px 0;">

<a
href="${meetLink}"
style="
display:inline-block;
padding:16px 36px;
background:#4f46e5;
color:white;
text-decoration:none;
font-size:16px;
font-weight:bold;
border-radius:10px;
">
 Join Google Meet
</a>

</div>

<!-- Fallback Link -->

<p style="font-size:14px;color:#6b7280;">
If the button doesn't work, copy and paste this link into your browser:
</p>

<p style="word-break:break-all;">
<a
href="${meetLink}"
style="color:#4f46e5;text-decoration:none;">
${meetLink}
</a>
</p>

<hr style="border:none;border-top:1px solid #e5e7eb;margin:40px 0;">

<p style="font-size:14px;color:#6b7280;line-height:1.7;margin:0;">
Need to reschedule or cancel your meeting? Please contact the host directly.
</p>

</td>
</tr>

<!-- Footer -->

<tr>
<td
align="center"
style="padding:30px;background:#f9fafb;color:#9ca3af;font-size:13px;">

<p style="margin:0;">
This email was sent automatically by
<strong style="color:#4f46e5;">NexMeet</strong>.
</p>

<p style="margin-top:10px;">
Thank you for using our scheduling platform.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
}

function bookingCancelledTemplate({
  guestName,
  hostName,
  eventTitle,
  date,
  startTime,
  endTime,
}) 
{
    return `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8" />
    <title>Booking Cancelled</title>
    </head>
    
    <body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
    <td align="center">
    
    <table width="600" cellpadding="0" cellspacing="0"
    style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,.08);">
    
    <tr>
    <td style="background:#ef4444;padding:30px;text-align:center;">
    <h1 style="margin:0;color:#fff;font-size:28px;">
    Booking Cancelled
    </h1>
    </td>
    </tr>
    
    <tr>
    <td style="padding:35px;">
    
    <p style="font-size:16px;color:#333;">
    Hi <strong>${guestName}</strong>,
    </p>
    
    <p style="font-size:15px;color:#555;line-height:1.7;">
    Your scheduled meeting with
    <strong>${hostName}</strong>
    has been cancelled.
    </p>
    
    <table width="100%" cellpadding="0" cellspacing="0"
    style="margin:30px 0;background:#fafafa;border:1px solid #ececec;border-radius:12px;padding:20px;">
    
    <tr>
    <td style="padding:8px 0;">
    <strong>Event</strong><br>
    ${eventTitle}
    </td>
    </tr>
    
    <tr>
    <td style="padding:8px 0;">
    <strong>Date</strong><br>
    ${date}
    </td>
    </tr>
    
    <tr>
    <td style="padding:8px 0;">
    <strong>Time</strong><br>
    ${startTime} - ${endTime}
    </td>
    </tr>
    
    <tr>
    <td style="padding:8px 0;">
    <strong>Host</strong><br>
    ${hostName}
    </td>
    </tr>
    
    </table>
    
    <div
    style="
    background:#FEF2F2;
    border:1px solid #FECACA;
    color:#991B1B;
    padding:16px;
    border-radius:10px;
    font-size:14px;
    line-height:1.6;
    ">
    The meeting has been removed from the host's schedule.
    If this cancellation was unexpected, you may contact the host to arrange another meeting.
    </div>
    
    <p
    style="
    margin-top:35px;
    font-size:14px;
    color:#777;
    line-height:1.7;
    ">
    Thank you for using
    <strong>Cally</strong>.
    </p>
    
    </td>
    </tr>
    
    <tr>
    <td
    style="
    background:#fafafa;
    padding:20px;
    text-align:center;
    font-size:12px;
    color:#888;
    ">
    © ${new Date().getFullYear()} Cally. All rights reserved.
    </td>
    </tr>
    
    </table>
    
    </td>
    </tr>
    </table>
    
    </body>
    </html>
    `;
}
    
    
module.exports = {generateOTP,otpTemplate,generateRandomWords,convertToMinutes,bookingConfirmationTemplate,bookingCancelledTemplate}