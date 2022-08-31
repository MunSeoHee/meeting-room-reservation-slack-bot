const { google } = require("googleapis");
require("dotenv").config();

const SCOPES = ["https://www.googleapis.com/auth/calendar", 'https://www.googleapis.com/auth/sqlservice.admin'];
const CalendarId = {
  large: process.env.CALENDAR_LARGE_ID,
  midium: process.env.CALENDAR_MIDIUM_ID,
  small: process.env.CALENDAR_SMALL_ID,
  test: process.env.CALENDAR_TEST_ID,
};

const jwtClient = new google.auth.JWT(
  process.env.USER_EMAIL,
  null,
  process.env.PRIVATE_KEY,
  SCOPES
);
const calendar = google.calendar({
  version: "v3",
  project: process.env.GOOGLE_PROJECT_NUMBER,
  auth: jwtClient,
});

const auth = new google.auth.GoogleAuth({
  keyFile: "./keys.json",
  scopes: SCOPES,
});

exports.getEvents = async (dateTimeStart, dateTimeEnd) => {
  try {
    return new Promise(async (resolve, reject) => {
      let events = Array();
      for (const [key, value] of Object.entries(CalendarId)) {
        let response = await calendar.events.list({
          auth: auth,
          calendarId: value,
          timeMin: dateTimeStart,
          timeMax: dateTimeEnd,
          timeZone: "Asia/Seoul",
          singleEvents: true,
          orderBy: "startTime",
        });
        events[key] = response["data"]["items"];
      }
      resolve(events);
    });
  } catch (error) {
    console.log(`Error at getEvents --> ${error}`);
    return 0;
  }
};

exports.insertEvents = async (dateTimeStart, dateTimeEnd, summary, AttendeesEmailList) => {
  try {
    return new Promise(async (resolve, reject) => {
      // const event = {
      //   summary: summary,
      //   start: {
      //     dateTime: dateTimeStart,
      //     timeZone: "Asia/Seoul",
      //   },
      //   end: {
      //     dateTime: dateTimeEnd,
      //     timeZone: "Asia/Seoul",
      //   },
      //   attendees: [
      //     { email: "sua@fanding.kr" },
      //   ],
      //   reminders: {
      //     useDefault: false,
      //     overrides: [{ method: "email", minutes: 24 * 60 }],
      //   },
      // };
      var calendarEvent = {
        summary: "Test Event added by Node.js",
        description: "This event was created by Node.js",
        start: {
          dateTime: "2022-06-03T09:00:00-02:00",
          timeZone: "Asia/Kolkata",
        },
        end: {
          dateTime: "2022-06-04T17:00:00-02:00",
          timeZone: "Asia/Kolkata",
        },
        attendees: [],
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 24 * 60 },
            { method: "popup", minutes: 10 },
          ],
        },
      };

      auth.getClient().then((auth) => {
        calendar.events.insert(
          {
            auth: auth,
            calendarId: CalendarId.test,
            resource: calendarEvent,
          },
          function (error, response) {
            if (error) {
              console.log("Something went wrong: " + error); // If there is an error, log it to the console
              return;
            }
        console.log("Event created successfully.")
            console.log("Event details: ", response.data); // Log the event details
          }
        );
      });
      resolve();
    })
  } catch (error) {
    console.log(`Error at getEvents --> ${error}`);
    return 0;
  }
};

// console.log(getEvents("2022-08-01T00:00:00Z", "2022-08-08T00:00:00Z"));
