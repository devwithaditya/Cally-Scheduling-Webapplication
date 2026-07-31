const { google } = require("googleapis");

// Used for Google Login
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

// Used for Google Calendar
const calendarOAuthClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALENDAR_REDIRECT_URI
);

module.exports = {
    oauth2Client,
    calendarOAuthClient,
};