const { google } = require("googleapis");

async function getCalendarClient(user) {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_CALENDAR_REDIRECT_URI
    );

    oauth2Client.setCredentials({
        refresh_token: user.googleRefreshToken,
    });

    return google.calendar({
        version: "v3",
        auth: oauth2Client,
    });
}


async function createCalendarEvent(user, booking) {
    const calendar = await getCalendarClient(user);

    const startDateTime = new Date(`${booking.date}T${booking.startTime}:00`);

    const endDateTime = new Date(`${booking.date}T${booking.endTime}:00`);

    const event = {
        summary: booking.eventTitle,
        description: booking.description,

        start: {
            dateTime: startDateTime.toISOString(),
            timeZone: user.timezone,
        },

        end: {
            dateTime:  endDateTime.toISOString(),
            timeZone: user.timezone,
        },

        attendees: [
            {
                email: booking.guestEmail,
            },
            {
                email: user.email,
            },
        ],

        conferenceData: {
            createRequest: {
                requestId: Date.now().toString(),
                conferenceSolutionKey: {
                    type: "hangoutsMeet",
                },
            },
        },
    };

    const response = await calendar.events.insert({
        calendarId: "primary",
        conferenceDataVersion: 1,
        sendUpdates: "all",
        requestBody: event,
    });

    console.log("Hangout Link:", response.data.hangoutLink);

    console.log(
        "Conference Data:",
        JSON.stringify(response.data.conferenceData, null, 2)
    );
    
    return response.data;
}


async function deleteCalendarEvent(user, googleEventId) {
    const calendar = await getCalendarClient(user);

    await calendar.events.delete({
        calendarId: "primary",
        eventId: googleEventId,
        sendUpdates: "all",
    });
}


module.exports = {
    getCalendarClient,
    createCalendarEvent,
    deleteCalendarEvent
};