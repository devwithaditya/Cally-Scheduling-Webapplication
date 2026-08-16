# Cally Frontend

Frontend application for **Cally**, a web-based appointment scheduling
platform. The frontend provides the user interface for authentication,
event management, availability management, public booking pages, Google
Calendar connection, and host booking management.

## Features

-   Responsive landing page
-   User registration and login
-   OTP verification flow
-   JWT-based authenticated sessions
-   Protected dashboard routes
-   User profile management
-   Event creation and management
-   Host availability management
-   Public booking pages using user and event slugs
-   Date and time slot selection
-   Real-time available-slot display from the backend
-   Booking confirmation interface
-   Booking details view
-   Booking cancellation
-   Cancellation loading state to prevent repeated clicks
-   Google Calendar connection flow
-   Google Calendar connection success page
-   Google Meet link display for bookings
-   Responsive desktop and mobile navigation
-   Animated UI transitions
-   API integration using Axios

## Tech Stack

  Category           Technology
  ------------------ -----------------------
  Framework          React
  Language           TypeScript
  Build Tool         Vite
  Styling            Tailwind CSS
  Routing            React Router
  HTTP Client        Axios
  Icons              Lucide React
  Animation          Framer Motion
  State Management   React Context API
  Authentication     JWT / Access Token
  Backend            Node.js + Express
  Database           MongoDB
  Calendar           Google Calendar API
  Meetings           Google Meet
  Email              Backend email service

## Project Structure

A typical frontend structure is:

``` text
frontend/
├── public/
│   └── ...
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── ...
│   ├── components/
│   │   └── ...
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── Landing.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── BookingPage.tsx
│   │   ├── GoogleCalendarSuccess.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   └── ...
│   ├── routes/
│   │   ├── AppRoutes.tsx
│   │   └── ProtectedRoute.tsx
│   ├── services/
│   │   └── api.ts
│   ├── App.tsx
│   └── main.tsx
├── .env
├── package.json
├── vite.config.ts
└── README.md
```

> Adjust the structure above if your current frontend folders differ.

## Requirements

Before running the frontend, install:

-   Node.js 18+ recommended
-   npm, pnpm, or another supported package manager
-   A running Cally backend API

## Installation

Clone the repository and enter the frontend directory:

``` bash
git clone <your-repository-url>
cd frontend
```

Install dependencies:

``` bash
npm install
```

If the project uses pnpm:

``` bash
pnpm install
```

## Environment Variables

Create a `.env` file in the frontend root.

For a Vite application, frontend environment variables must use the
`VITE_` prefix.

Example:

``` env
VITE_API_URL=http://localhost:3000/api
```

For production:

``` env
VITE_API_URL=https://your-backend-domain.com/api
```

### Environment variable description

  Variable         Purpose
  ---------------- -----------------------------------
  `VITE_API_URL`   Base URL of the Cally backend API

**Do not put private secrets in frontend environment variables.**

Anything beginning with `VITE_` can be exposed to the browser after the
frontend is built.

## Running the Application

### Development

``` bash
npm run dev
```

or:

``` bash
pnpm dev
```

Vite normally starts the frontend at:

``` text
http://localhost:5173
```

### Production Build

``` bash
npm run build
```

Preview the production build locally:

``` bash
npm run preview
```

## Authentication

Cally uses an access-token and refresh-token authentication flow.

### Login Flow

``` text
Login Page
    ↓
Submit email + password
    ↓
Backend validates credentials
    ↓
Receive access token
    ↓
Store access token
    ↓
Load authenticated user
    ↓
Open Dashboard
```

The frontend uses the authentication context to maintain the current
user.

## AuthContext

The authentication state is managed through React Context.

The context provides:

``` text
user
loading
setUser
loadUser()
login()
logout()
```

The application uses this state to determine whether a user is
authenticated.

### Loading User

When the application starts:

``` text
Read accessToken
      ↓
Token exists?
   /        Yes        No
 ↓          ↓
Set token   Stop loading
 ↓
GET /users/me
 ↓
Set authenticated user
```

If the user cannot be authenticated, the frontend clears the
authentication state.

## Protected Routes

Authenticated dashboard pages are wrapped with `ProtectedRoute`.

The basic flow is:

``` text
Protected Route
      ↓
Is authentication loading?
      │
     Yes
      ↓
 Loading...

     No
      ↓
Is user available?
   /           No            Yes
 ↓              ↓
Login         Dashboard
```

Example:

``` tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

## Routing

The application uses React Router.

Main route areas include:

``` text
/
├── /login
├── /register
├── /dashboard
├── /bookings/:userSlug/:eventSlug
├── /google-success
├── /google-calendar-success
├── /about
└── /contact
```

The exact routes in `AppRoutes.tsx` are the source of truth.

## Dashboard

The dashboard provides the host with a centralized interface for
managing the scheduling system.

### Dashboard Sections

-   Events
-   Bookings
-   Availability
-   Profile

### Events

Hosts can:

-   Create events
-   View events
-   Edit events
-   Delete events
-   Configure event duration
-   Configure event title and description
-   Use a public event slug

### Availability

Hosts can configure weekly availability, for example:

``` text
Monday
09:00 - 10:00
12:00 - 13:00

Tuesday
09:00 - 10:00
12:00 - 13:00
```

The frontend sends availability information to the backend.

## Public Booking Page

Guests can access a public booking URL such as:

``` text
/bookings/:userSlug/:eventSlug
```

The booking page:

1.  Loads the host.
2.  Loads the selected event.
3.  Displays the calendar/date selector.
4.  Requests available slots from the backend.
5.  Displays only available times.
6.  Collects guest information.
7.  Submits the booking.
8.  Displays the confirmation state.

## Available Slot Flow

``` text
Guest selects date
       ↓
Frontend requests available slots
       ↓
Backend checks host availability
       ↓
Backend checks existing bookings
       ↓
Backend removes conflicting slots
       ↓
Frontend receives free slots
       ↓
Guest selects a slot
```

The frontend does not rely only on visual slot availability. The backend
performs the final conflict validation when the booking is submitted.

## Booking

The booking form sends:

``` json
{
  "guestName": "Guest Name",
  "guestEmail": "guest@example.com",
  "date": "YYYY-MM-DD",
  "startTime": "09:00",
  "notes": "Optional notes"
}
```

The frontend then receives the created booking and moves the UI to the
confirmation state.

Example:

``` text
Submit Booking
      ↓
POST booking API
      ↓
Booking created
      ↓
Google Calendar event created by backend
      ↓
Google Meet link generated
      ↓
Confirmation email sent by backend
      ↓
Frontend displays confirmation
```

## Google Calendar Connection

Hosts can connect their Google Calendar from the dashboard.

The frontend starts the OAuth flow by redirecting the browser to the
backend Google Calendar endpoint.

``` text
Dashboard
   ↓
Connect Google Calendar
   ↓
Backend OAuth URL
   ↓
Google Consent Screen
   ↓
Backend OAuth Callback
   ↓
GoogleCalendarSuccess page
   ↓
Dashboard
```

The Google OAuth client secret and refresh token are never handled
directly by the frontend.

## Google Calendar Connection Status

The authenticated user contains:

``` ts
calendarConnected?: boolean;
```

The dashboard can use this value to display:

``` text
Google Calendar Connected
```

or:

``` text
Connect Google Calendar
```

## Google Meet

The frontend does not generate the Google Meet link itself.

The backend creates the Google Calendar event and Google Meet
conference.

The resulting booking can contain:

``` text
googleEventId
meetLink
```

The host can view the meeting link from the detailed booking view when
one is available.

## Booking Cancellation

Hosts can cancel a confirmed booking from the dashboard.

The frontend cancellation flow is:

``` text
Click Cancel
      ↓
Set cancelling state
      ↓
Disable button
      ↓
Display "Cancelling..."
      ↓
DELETE booking API
      ↓
Backend removes Google Calendar event
      ↓
Backend sends cancellation email
      ↓
Backend marks booking as cancelled
      ↓
Frontend updates booking state
      ↓
Display "Cancelled"
```

The loading state prevents users from accidentally sending multiple
cancellation requests.

Example UI behavior:

``` text
[ Cancel ]
     ↓
[ ⟳ Cancelling... ]
     ↓
[ Cancelled ]
```

## API Service

API requests are centralized through the frontend API service.

Typical configuration:

``` ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
```

The service can also attach the current access token to protected
requests.

This keeps API configuration separate from individual components.

## UI and Design

The application uses:

-   Tailwind CSS for styling
-   Lucide React for interface icons
-   Framer Motion for animations
-   Responsive layouts for desktop and mobile
-   Reusable components and dashboard sections

The UI is designed around a clean SaaS-style scheduling experience.

## Responsive Design

Cally supports:

-   Desktop navigation
-   Mobile navigation
-   Responsive booking pages
-   Responsive dashboard layouts
-   Mobile-friendly forms and dialogs

The dashboard includes a desktop sidebar and a mobile navigation bar.

## Error Handling

Frontend API operations should provide user feedback for:

-   Invalid login credentials
-   Registration errors
-   OTP verification errors
-   Expired authentication
-   Unavailable booking slots
-   Already-booked slots
-   Failed bookings
-   Calendar connection errors
-   Booking cancellation errors
-   Network/API failures

Loading states should be displayed for longer operations such as:

-   Login
-   Registration
-   Booking
-   Calendar connection
-   Cancellation

## Frontend Security

Important security practices:

-   Never store Google client secrets in the frontend.
-   Never expose Google OAuth client secrets.
-   Do not put database credentials in Vite environment variables.
-   Use backend authorization for protected operations.
-   Treat frontend validation as user experience, not final security.
-   Let the backend perform ownership and booking-conflict checks.
-   Clear local authentication state on logout or invalid
    authentication.

## Development Workflow

Typical development workflow:

``` text
Start MongoDB
     ↓
Start Backend
     ↓
Start Frontend
     ↓
Open http://localhost:5173
     ↓
Register / Login
     ↓
Configure Event
     ↓
Configure Availability
     ↓
Connect Google Calendar
     ↓
Test Public Booking
     ↓
Test Confirmation
     ↓
Test Cancellation
```

## Testing Checklist

### Authentication

-   [ ] Register a new account.
-   [ ] Receive OTP.
-   [ ] Verify OTP.
-   [ ] Login successfully.
-   [ ] Access dashboard.
-   [ ] Logout.
-   [ ] Verify protected routes redirect to login.
-   [ ] Verify expired/invalid authentication is rejected.

### Events

-   [ ] Create an event.
-   [ ] Edit an event.
-   [ ] Delete an event.
-   [ ] Verify public event URL.

### Availability

-   [ ] Configure weekday availability.
-   [ ] Configure multiple availability windows.
-   [ ] Verify unavailable days.
-   [ ] Verify available time slots.

### Booking

-   [ ] Open public booking page.
-   [ ] Select a date.
-   [ ] Select an available time.
-   [ ] Submit booking.
-   [ ] Verify confirmation.
-   [ ] Try an already-booked time.
-   [ ] Verify overlapping slots are blocked.

### Google Calendar

-   [ ] Connect Google Calendar.
-   [ ] Verify connected state.
-   [ ] Create a booking.
-   [ ] Verify Calendar event.
-   [ ] Verify Google Meet link.
-   [ ] Cancel booking.
-   [ ] Verify Calendar event removal.

### Email

-   [ ] Verify booking confirmation email.
-   [ ] Verify cancellation email.
-   [ ] Verify Google Meet link in the confirmation email.

## Common Issues

### Dashboard appears after logout

The browser may restore a previous page using its Back/Forward Cache.
The protected route should still validate the current authentication
state.

After logout, verify:

-   Access token is removed.
-   Refresh token cookie is cleared.
-   User state is set to `null`.
-   Protected routes redirect to `/login`.

### Booking slot is unavailable

The frontend receives available slots from the backend. Check:

-   Selected date
-   Host availability
-   Event duration
-   Existing bookings
-   Host timezone

### Google Calendar connection fails

Check:

-   Backend URL
-   Google OAuth configuration
-   Redirect URI
-   Backend availability
-   `VITE_API_URL`

### API requests fail

Check:

``` text
Frontend
http://localhost:5173
       ↓
VITE_API_URL
       ↓
Backend
http://localhost:3000
```

Make sure the backend is running and the environment variable contains
the correct API base URL.

## Production Build

Create a production build:

``` bash
npm run build
```

The generated output is normally placed in:

``` text
dist/
```

Before deployment:

-   [ ] Set the production `VITE_API_URL`.
-   [ ] Build the application.
-   [ ] Configure the backend CORS origin.
-   [ ] Configure HTTPS.
-   [ ] Verify Google OAuth redirect behavior.
-   [ ] Test authentication.
-   [ ] Test public booking.
-   [ ] Test Google Calendar.
-   [ ] Test email notifications.
-   [ ] Test cancellation.

## Deployment

The frontend can be deployed to a static hosting platform such as:

-   Netlify
-   Vercel
-   Cloudflare Pages
-   AWS
-   Other static hosting providers

The exact deployment process depends on the selected platform.

## Backend Dependency

The frontend requires the Cally backend API to provide:

-   Authentication
-   User profile APIs
-   Event APIs
-   Availability APIs
-   Booking APIs
-   Google Calendar OAuth
-   Booking cancellation
-   Email notifications

For backend setup, refer to the backend README.

## Author

**Aditya Raj**\
B.Tech -- Information Technology\
Chandigarh Engineering College

## License

This project is currently developed as an academic/personal project. Add
an open-source license if the project is later released publicly.

------------------------------------------------------------------------

**Cally --- Schedule smarter. Meet easier.**
