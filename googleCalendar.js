const {google} = require('googleapis');

// Google calendar API settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version : "v3"});


const getEvents = async (dateTimeStart, dateTimeEnd) => {
  try {
      let response = await calendar.events.list({
          auth: auth,
          calendarId: calendarId,
          timeMin: dateTimeStart,
          timeMax: dateTimeEnd,
      });
      response['data']['items'].map(item => {
        console.log(item);
      })
      let items = response['data']['items'];
      return items;
  } catch (error) {
      console.log(`Error at getEvents --> ${error}`);
      return 0;
  }
}

console.log(getEvents("2022-08-01T00:00:00Z", "2022-08-08T00:00:00Z"));