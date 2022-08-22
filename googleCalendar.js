const {google} = require('googleapis');
require("dotenv").config();

const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version : "v3"});
const CalendarId = {
  "large": process.env.CALENDAR_LARGE_ID,
  "midium": process.env.CALENDAR_MIDIUM_ID,
  "small": process.env.CALENDAR_SMALL_ID
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
          timeZone: 'Asia/Seoul',
          singleEvents: true,
          orderBy: 'startTime'
        });
        events[key] = response['data']['items'];
      }
      resolve(events);
    });
  } catch (error) {
      console.log(`Error at getEvents --> ${error}`);
      return 0;
  }
};

// console.log(getEvents("2022-08-01T00:00:00Z", "2022-08-08T00:00:00Z"));