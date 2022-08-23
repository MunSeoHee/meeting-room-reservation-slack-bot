const { google } = require("googleapis");
require("dotenv").config();

const SCOPES = "https://www.googleapis.com/auth/calendar";
const calendar = google.calendar({ version: "v3" });
const CalendarId = {
  large: process.env.CALENDAR_LARGE_ID,
  midium: process.env.CALENDAR_MIDIUM_ID,
  small: process.env.CALENDAR_SMALL_ID,
  test: process.env.CALENDAR_TEST_ID,
};

const auth = new google.auth.JWT(
  process.env.USER_EMAIL,
  null,
  process.env.PRIVATE_KEY,
  SCOPES
);

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

exports.insertEvents = async (
  dateTimeStart,
  dateTimeEnd,
  summary,
  creatorEmail,
  AttendeesEmailList
) => {
  try {
    var event = {
      summary: summary,
      start: {
        dateTime: dateTimeStart,
        timeZone: "Asia/Seoul",
      },
      end: {
        dateTime: dateTimeEnd,
        timeZone: "Asia/Seoul",
      },
      attendees: [
        { email: "lpage@example.com" },
        { email: "sbrin@example.com" },
      ],
      reminders: {
        useDefault: false,
        overrides: [{ method: "email", minutes: 24 * 60 }],
      },
    };

    calendar.events.insert(
      {
        auth: auth,
        calendarId: CalendarId.test,
        resource: event,
      },
      function (err, event) {
        if (err) {
          console.log(
            "There was an error contacting the Calendar service: " + err
          );
          return;
        }
        console.log("Event created: %s", event.htmlLink);
      }
    );
  } catch (error) {
    console.log(`Error at getEvents --> ${error}`);
    return 0;
  }
};

// console.log(getEvents("2022-08-01T00:00:00Z", "2022-08-08T00:00:00Z"));
