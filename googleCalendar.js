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
    var event = {
      'summary': 'Google I/O 2015',
      'location': '800 Howard St., San Francisco, CA 94103',
      'description': 'A chance to hear more about Google\'s developer products.',
      'start': {
        'dateTime': '2015-05-28T09:00:00-07:00',
        'timeZone': 'America/Los_Angeles',
      },
      'end': {
        'dateTime': '2015-05-28T17:00:00-07:00',
        'timeZone': 'America/Los_Angeles',
      },
      'recurrence': [
        'RRULE:FREQ=DAILY;COUNT=2'
      ],
      'attendees': [
        {'email': 'lpage@example.com'},
        {'email': 'sbrin@example.com'},
      ],
      'reminders': {
        'useDefault': false,
        'overrides': [
          {'method': 'email', 'minutes': 24 * 60},
          {'method': 'popup', 'minutes': 10},
        ],
      },
    };

    calendar.events.insert({
      auth: auth,
      calendarId: 'primary',
      resource: event,
    }, function(err, event) {
      if (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
        return;
      }
      console.log('Event created: %s', event.htmlLink);
    });
  } catch (error) {
      console.log(`Error at getEvents --> ${error}`);
      return 0;
  }
};

// console.log(getEvents("2022-08-01T00:00:00Z", "2022-08-08T00:00:00Z"));