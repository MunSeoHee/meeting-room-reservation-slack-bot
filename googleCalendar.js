const {google} = require('googleapis');
require("dotenv").config();

const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version : "v3"});
const CalendarId = {
  "large": process.env.CALENDAR_LARGE_ID,
  "midium": process.env.CALENDAR_MIDIUM_ID,
  "small": process.env.CALENDAR_SMALL_ID,
  'test': process.env.CALENDAR_TEST_ID
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

exports.insertEvents = async (dateTimeStart, dateTimeEnd) => {
  try {
    event = {
      'summary': 'itsplay의 OpenAPI 수업',
      'location': '서울특별시 성북구 정릉동 정릉로 77',
      'description': 'itsplay와 OpenAPI 수업에 대한 설명입니다.',
      'start': {
          'dateTime': today + 'T09:00:00',
          'timeZone': 'Asia/Seoul',
      },
      'end': {
          'dateTime': today + 'T10:00:00',
          'timeZone': 'Asia/Seoul',
      },
      'recurrence': [
          'RRULE:FREQ=DAILY;COUNT=2'
      ],
      'attendees': [
          {'email': 'lpage@example.com'},
          {'email': 'sbrin@example.com'},
      ],
      'reminders': {
          'useDefault': False,
          'overrides': [
              {'method': 'email', 'minutes': 24 * 60},
              {'method': 'popup', 'minutes': 10},
          ],
      },
  };
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