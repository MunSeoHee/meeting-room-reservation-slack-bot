const { google } = require("googleapis");
require("dotenv").config();

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  'https://www.googleapis.com/auth/sqlservice.admin',
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/admin.directory.resource.calendar"
];
const CalendarId = {
  large: process.env.CALENDAR_LARGE_ID,
  medium: process.env.CALENDAR_MIDIUM_ID,
  small: process.env.CALENDAR_SMALL_ID,
  test: process.env.CALENDAR_TEST_ID,
};

const jwtClient = new google.auth.JWT(
  process.env.USER_EMAIL,
  null,
  process.env.PRIVATE_KEY,
  SCOPES,
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

exports.getEvents = async (dateTimeStart, dateTimeEnd, meetingRoom = "all") => {
  try {
    console.log("**************************");
    console.log(dateTimeStart, dateTimeEnd, meetingRoom);
    console.log("**************************");
    return new Promise(async (resolve, reject) => {
      let events = Array();
      if (meetingRoom === 'all') {
        for (const [key, value] of Object.entries(CalendarId)) {
          let response = await calendar.events.list({
            auth: jwtClient,
            calendarId: value,
            timeMin: dateTimeStart,
            timeMax: dateTimeEnd,
            timeZone: "Asia/Seoul",
            singleEvents: true,
            orderBy: "startTime",
          }
          );
          events[key] = response["data"]["items"];
        }
      }
      else {
        try{
          if (dateTimeStart.split('-')[1].length < 2) dateTimeStart = dateTimeStart.slice(0,5) + '0' + dateTimeStart.slice(5) + '+09:00';
          else dateTimeStart += '+09:00';
          if (dateTimeEnd.split('-')[1].length < 2) dateTimeEnd = dateTimeEnd.slice(0,5) + '0' + dateTimeEnd.slice(5) + '+09:00';
          else dateTimeEnd += '+09:00';

          let response = await calendar.events.list({
            auth: jwtClient,
            calendarId: CalendarId[meetingRoom],
            timeMin: dateTimeStart,
            timeMax: dateTimeEnd,
            timeZone: "Asia/Seoul",
            singleEvents: true,
            orderBy: "startTime",
          });
          events[meetingRoom] = response["data"]["items"];
          console.log(events);
        } catch(error){console.log(error);}
      }
      resolve(events);
    });
  } catch (error) {
    console.log(`Error at getEvents --> ${error}`);
    return 0;
  }
};

exports.insertEvents = async (dateTimeStart, dateTimeEnd, attendeesEmailList, useReason, meetingRoom) => {
  try {
    return new Promise(async (resolve, reject) => {
      const event = await this.getEvents(dateTimeStart, dateTimeEnd, meetingRoom);
      console.log(event);
      var calendarEvent = {
        summary: useReason,
        start: {
          dateTime: dateTimeStart,
          timeZone: "Asia/Seoul",
        },
        end: {
          dateTime: dateTimeEnd,
          timeZone: "Asia/Seoul",
        },
        attendees: [],
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
              console.log("Something went wrong: " + error);
              return;
            }
            // console.log("Event created successfully.")
            // console.log("Event details: ", response.data);
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
