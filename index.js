const { App } = require('@slack/bolt');
const blocks = require('./block');
const googleCalendar = require('./googleCalendar');
require("dotenv").config();

const app = new App({
  token: process.env.TOKEN,
  signingSecret: process.env.SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN
});

app.message('', async ({ message, say }) => {
  await say({
    text: `📝회의실 예약 도우미`,
    blocks: blocks.Main
  });
});

app.action("viewInsertModal", async ({ body, ack, say, client }) => {
    await ack();
    try {
      const result = await client.views.open({
        trigger_id: body.trigger_id,
        view: {
          type: "modal",
          callback_id: "InsertEvent",
          title: {
            type: "plain_text",
            text: "회의실 예약 폼",
          },
          blocks: blocks.CalendarInsertModal,
          submit: {
            type: "plain_text",
            text: "Submit",
          },
        },
      });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  });

app.action("viewGetModal", async ({ body, ack, say, client }) => {
  await ack();
  try {
    const result = await client.views.open({
      trigger_id: body.trigger_id,
      view: {
        type: "modal",
        callback_id: "GetEvent",
        title: {
          type: "plain_text",
          text: "회의실 조회 폼",
        },
        blocks: blocks.CalendarGetModal,
        submit: {
          type: "plain_text",
          text: "Submit",
        },
      },
    });
  } catch (error) {
    console.error(error);
  }
});

app.view("InsertEvent", async ({ ack, body, view, client}) => {
await ack();
// const question = view.blocks[1]["label"]["text"];
// const answer = view["state"]["values"]["question"]["answer"]["value"];
// const user = body.user.name;
// const result = "정답입니다."
console.log(body.user.id);
try {
    await client.chat.postMessage({
    channel: body.user.id,
    text: `${view}`,
    });
} catch (error) {
    console.error(error);
}
});

app.view("GetEvent", async ({ ack, body, view, client}) => {
  await ack();
  const selectedDate = view["state"]["values"]["input"]["datepicker"]["selected_date"];
  const allEventList = await googleCalendar.getEvents(selectedDate+"T00:00:00Z", selectedDate+"T23:59:59Z");
  const jsonBlocks = [];
  for (const [roomTitle, eventList] of Object.entries(allEventList)) {
    jsonBlocks.push({
      "type": "divider"
    });
    jsonBlocks.push({
      "type": "context",
      "elements": [
        {
          "type": "plain_text",
          "text": roomTitle,
          "emoji": false
        }
      ]
    });
    jsonBlocks.push({
      "type": "divider"
    });

    for (const [key, event] of Object.entries(eventList)) {
      if (!event.summary) continue;
      console.log(event);
      jsonBlocks.push({
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*" + event.summary + "*"
        }
      });
      jsonBlocks.push({
        "type": "section",
        "fields": [
          {
            "type": "plain_text",
            "text": event.creator.email,
            "emoji": true
          },
          {
            "type": "plain_text",
            "text": event.start.dateTime.split('T')[1].split('+')[0].slice(0,5) + "-" + event.end.dateTime.split('T')[1].split('+')[0].slice(0,5),
            "emoji": true
          }
        ]
      });
    }
  }

  try {
      await client.chat.postMessage({
      channel: body.user.id,
      blocks: jsonBlocks,
      });
  } catch (error) {
      console.error(error);
  }
  });

(async () => {
  try{
    await app.start(process.env.PORT || 3000);
    console.log('⚡️ Bolt app is running!');
  } catch (error) {
    console.error(error);
  }
})();
