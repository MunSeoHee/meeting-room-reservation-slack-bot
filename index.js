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
  const eventList = await googleCalendar.getEvents(selectedDate+"T00:00:00Z", selectedDate+"T23:59:59Z");

  for (const [key, value] of Object.entries(eventList)) {
    console.log(`${key}: ${value}`);
    for (const [ikey, ivalue] of Object.entries(value)) {
      console.log(JSON.stringify(ivalue));
      console.log(ivalue.summary, ivalue.creator.email, ivalue.summary);
    }
  }

  try {
      await client.chat.postMessage({
      channel: body.user.id,
      text: `${view}`,
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
