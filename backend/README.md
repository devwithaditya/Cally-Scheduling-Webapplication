# Cally Backend

Backend API for **Cally**, a web-based appointment scheduling platform.
The backend handles authentication, event management, host availability,
bookings, Google Calendar/Google Meet integration, and email
notifications.

## Features

-   User registration and OTP email verification
-   JWT-based authentication
-   Access-token and refresh-token authentication flow
-   HTTP-only refresh-token cookie
-   User profile management
-   Public scheduling links using user/event slugs
-   Event creation and management
-   Weekly host availability management
-   Automatic available-slot generation
-   Booking conflict and overlap detection
-   Google Calendar OAuth integration
-   Automatic Google Calendar event creation
-   Automatic Google Meet link generation
-   Google Calendar event cancellation
-   Booking confirmation emails
-   Booking cancellation emails
-   Protected API routes using authentication middleware
-   MongoDB persistence using Mongoose

## Tech Stack

  Category               Technology
  ---------------------- -------------------------
  Runtime                Node.js
  Framework              Express.js
  Database               MongoDB
  ODM                    Mongoose
  Authentication         JWT
  Password/OTP hashing   bcrypt
  Calendar integration   Google Calendar API
  Video meetings         Google Meet
  Email                  Nodemailer + Gmail SMTP
  Configuration          dotenv
  API style              REST

## Project Structure

``` text
backend/
├── src/
│   ├── controller/
│   │   ├── auth.controller.js
│   │   ├── booking.controller.js
│   │   ├── event.controller.js
│   │   ├── availability.controller.js
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── ...
│   ├── models/
│   │   ├── auth.model.js
│   │   ├── booking.model.js
│   │   ├── event.model.js
│   │   ├── availability.model.js
│   │   └── ...
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── booking.routes.js
│   │   ├── event.routes.js
│   │   └── ...
│   ├── services/
│   │   ├── calendar.service.js
│   │   └── email.service.js
│   └── utils/
│       └── utils.js
├── server.js
├── package.json
├── .env
└── README.md
```

> Adjust the structure above if your local folder names differ.

## Requirements

-   Node.js 18+ recommended
-   MongoDB or MongoDB Atlas
-   Google Cloud project with Google Calendar API enabled
-   Google OAuth 2.0 credentials
-   Gmail/SMTP credentials for email delivery

## Installation

``` bash
git clone <your-repository-url>
cd backend
npm install
```

## Environment Variables

Create a `.env` file in the backend root:

``` env
PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_SECRETS=your_jwt_secret

EMAIL_SERVICE_USER=your_email@gmail.com
EMAIL_SERVICE_PASS=your_gmail_app_password

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALENDAR_REDIRECT_URI=http://localhost:3000/api/auth/google/calendar/callback

FRONTEND_URL=http://localhost:5173
```

  Variable                         Purpose
  -------------------------------- -------------------------------------
  `PORT`                           Backend server port
  `MONGO_URI`                      MongoDB connection string
  `JWT_SECRETS`                    Secret used to sign/verify JWTs
  `EMAIL_SERVICE_USER`             Email/SMTP sender account
  `EMAIL_SERVICE_PASS`             Gmail App Password or SMTP password
  `GOOGLE_CLIENT_ID`               Google OAuth client ID
  `GOOGLE_CLIENT_SECRET`           Google OAuth client secret
  `GOOGLE_CALENDAR_REDIRECT_URI`   Google Calendar OAuth callback URL
  `FRONTEND_URL`                   Frontend application URL

**Never commit `.env` to Git.**

Recommended `.gitignore`:

``` gitignore
node_modules/
.env
.env.*
!.env.example
npm-debug.log*
```

If credentials have ever been committed publicly, revoke and regenerate
them.

## Running the Server

Development:

``` bash
npm run dev
```

If a `dev` script is not configured:

``` bash
node server.js
```

Typical local backend URL:

``` text
http://localhost:3000
```

## Authentication Flow

Cally uses JWT authentication.

### Registration

``` text
User
  ↓
POST /register
  ↓
Create user
  ↓
Generate OTP
  ↓
Hash OTP
  ↓
Send OTP email
  ↓
POST /otp-verify
  ↓
Mark user as verified
```

### Login

``` text
Email + Password
       ↓
Verify credentials
       ↓
Create access token
       ↓
Create refresh token
       ↓
Store refresh token in HTTP-only cookie
```

### Refresh Token

The refresh-token endpoint verifies the HTTP-only refresh-token cookie
and can issue a new access token.

### Logout

The logout endpoint clears the refresh-token cookie.

## Google Calendar Integration

Hosts can connect Google Calendar from the Cally dashboard.

### OAuth Flow

``` text
Cally Dashboard
      ↓
Connect Google Calendar
      ↓
Google OAuth Consent
      ↓
OAuth Callback
      ↓
Exchange Authorization Code
      ↓
Store Google Refresh Token
      ↓
calendarConnected = true
```

The stored refresh token is used to access the host's primary calendar.

### Booking + Google Calendar

``` text
Guest selects slot
       ↓
Validate host availability
       ↓
Check existing bookings
       ↓
Create booking
       ↓
Create Google Calendar event
       ↓
Generate Google Meet conference
       ↓
Store googleEventId + meetLink
       ↓
Send confirmation email
```

## Booking Conflict Detection

The backend calculates the booking start and end time from the selected
start time and event duration.

A booking conflicts when:

``` text
newStart < existingEnd
AND
newEnd > existingStart
```

Example:

``` text
Existing booking: 09:00 - 10:00

30-minute event:
09:00 - 09:30  ❌
09:30 - 10:00  ❌
09:45 - 10:15  ❌
10:00 - 10:30  ✅
```

This prevents overlapping meetings across different event types and
durations.

## Availability

Hosts can configure multiple availability windows for each weekday.

Example:

``` json
{
  "Monday": [
    {
      "startTime": "09:00",
      "endTime": "10:00"
    },
    {
      "startTime": "12:00",
      "endTime": "13:00"
    }
  ]
}
```

The booking API:

1.  Determines the weekday.
2.  Loads the host's availability.
3.  Generates slots based on event duration.
4.  Checks confirmed bookings.
5.  Removes overlapping slots.
6.  Returns only bookable times.

## Booking Cancellation

When a host cancels a booking:

``` text
Cancel request
     ↓
Find booking
     ↓
Delete Google Calendar event
     ↓
Send cancellation email
     ↓
Set booking status = cancelled
     ↓
Save booking
```

Cancelled bookings are retained so booking history is preserved.

## Email Notifications

Nodemailer is used for transactional emails.

Current booking-related notifications include:

-   Booking confirmation
-   Booking cancellation

A confirmation email can contain:

-   Guest name
-   Host name
-   Event title
-   Date
-   Start time
-   End time
-   Google Meet link

## API Areas

The exact route names in the project are the source of truth, but the
backend provides functionality in these areas.

### Authentication

``` text
POST /register
POST /otp-verify
POST /login
POST /refresh-token
POST /logout
```

### Users

``` text
GET  /users/me
PUT  /users/me
GET  /users/:slug
```

### Events

``` text
GET    /events
POST   /events
PUT    /events/:id
DELETE /events/:id
```

### Availability

``` text
GET /availability
PUT /availability
```

### Public Booking

``` text
GET  /booking/:userSlug/:eventSlug?date=YYYY-MM-DD
POST /bookings/:userSlug/:eventSlug
```

### Host Bookings

``` text
GET    /bookings
GET    /bookings/:id
DELETE /bookings/:id
```

> If your route files use different prefixes or names, follow the actual
> route definitions in the project.

## Security

The backend uses:

-   bcrypt password and OTP hashing
-   JWT authentication
-   HTTP-only refresh-token cookies
-   Protected routes through authentication middleware
-   Booking ownership checks
-   Environment variables for secrets and OAuth credentials

For production, also configure:

-   HTTPS
-   Secure cookies
-   Restricted CORS origins
-   Rate limiting
-   Request validation
-   Security headers
-   Strong production secrets
-   Production Google OAuth configuration

## Local Development

Typical local setup:

``` text
Frontend: http://localhost:5173
Backend:  http://localhost:3000
```

The Google OAuth redirect URI must exactly match the URI configured in
Google Cloud.

Example:

``` text
http://localhost:3000/api/auth/google/calendar/callback
```

## Testing the Booking Flow

1.  Register an account.
2.  Verify the OTP.
3.  Log in.
4.  Create an event.
5.  Configure availability.
6.  Connect Google Calendar.
7.  Open the public event URL.
8.  Select a date.
9.  Select an available time.
10. Submit the booking.
11. Verify the booking in MongoDB.
12. Verify the Google Calendar event.
13. Verify the Google Meet link.
14. Verify the confirmation email.
15. Cancel the booking from the host dashboard.
16. Verify the Google Calendar event is removed.
17. Verify the cancellation email.
18. Verify the booking status becomes `cancelled`.

## Common Issues

### Google Meet link is undefined 

First check whether calendar is connected or not in profile section
if not then connect the calendar because both are interconnected.

Then Check :
Make sure the Calendar event request includes conference data:

``` js
conferenceData: {
  createRequest: {
    requestId: Date.now().toString(),
    conferenceSolutionKey: {
      type: "hangoutsMeet",
    },
  },
}
```

and:

``` js
conferenceDataVersion: 1
```

Then read the generated link from the returned Google Calendar event.

### Email says "No recipients defined"

Verify that a valid recipient is passed to Nodemailer:

``` js
await sendEmail({
  to: guestEmail,
  subject: "Booking Confirmed",
  html: emailTemplate
});
```

Also verify the email environment variables.

### Google Calendar is not connecting

Check:

-   Google OAuth credentials
-   Redirect URI
-   Google Calendar API
-   Stored `googleRefreshToken`
-   `calendarConnected`
-   OAuth consent configuration

### Host is shown as unavailable

Check:

-   Requested date
-   Weekday calculation
-   Availability object
-   Event duration
-   Start/end times
-   Host timezone

## Production Checklist

Before deployment:

-   [ ] Set production environment variables.
-   [ ] Use HTTPS.
-   [ ] Enable secure cookies.
-   [ ] Replace localhost URLs.
-   [ ] Configure production Google OAuth redirect URI.
-   [ ] Restrict CORS to the production frontend.
-   [ ] Never expose Google client secrets or JWT secrets.
-   [ ] Configure email delivery.
-   [ ] Test Google Calendar OAuth in production.
-   [ ] Test booking and cancellation flows.
-   [ ] Verify Google Meet generation.
-   [ ] Verify email notifications.

## Author

**Aditya Raj**\
B.Tech -- Information Technology\
Chandigarh Engineering College

## License

This project is currently developed as an academic/personal project. Add
an open-source license if the project is later released publicly.

------------------------------------------------------------------------

**Cally --- Schedule smarter. Meet easier.**
