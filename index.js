const { App } = require("@slack/bolt");
const blocks = require("./block");
const googleCalendar = require("./googleCalendar");
require("dotenv").config();
const meetingRoomTitle = {large:'3층 대회의실(10인)', medium: '4층 중회의실(6인)', small: '4층 소회의실(4인)', test: '테스트'};
const app = new App({
  token: process.env.TOKEN,
  signingSecret: process.env.SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
});

app.message("", async ({ message, say }) => {
  await say({
    text: `📝회의실 예약 도우미`,
    blocks: blocks.Main,
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

app.action("eventCancel", async ({ body, ack, say, client }) => {
  await ack();
  try {
    const value = body['actions'][0]['value'].split("||");
    console.log(value);
    googleCalendar.deleteEvents(value[0], value[1]);
    await client.chat.postMessage({
      channel: body.user.id,
      text: '예약 취소 성공😁',
    });
  } catch (error) {
    console.error(error);
  }
});

app.view("InsertEvent", async ({ ack, body, view, client }) => {
  await ack();
  const meetingRoom = view["state"]["values"]["meetingRoom"]["meetingRoom"]["selected_option"]["value"];
  const attendeesIdList = view["state"]["values"]["multiUserSelect"]["multiUserSelect"]["selected_users"];
  attendeesIdList.unshift(body.user.id);
  const date = view["state"]["values"]["Date"]["Date"]["selected_date"];
  const startTime = view["state"]["values"]["StartTime"]["StartTime"]["selected_time"];
  const EndTime = view["state"]["values"]["EndTime"]["EndTime"]["selected_time"];
  const useReason = view["state"]["values"]["useReason"]["useReason"]["value"];
  let attendeesEmailJsonList = [];

  try {
    for (const userId of attendeesIdList) {
      const createUserInfo = await client.users.info({user: userId});
      attendeesEmailJsonList.push({'email' : createUserInfo["user"]["profile"]["email"]});
    }

    await googleCalendar.insertEvents(date + "T" + startTime + ":00", date + "T" + EndTime + ":00", attendeesEmailJsonList, useReason, meetingRoom);
    await client.chat.postMessage({
      channel: body.user.id,
      text: '예약 성공😁',
    });
  } catch (error) {
    console.error(error);
    await client.chat.postMessage({
      channel: body.user.id,
      text: '예약 실패😂 : 해당 시간에 중복되는 예약 건이 존재합니다',
    });
  }
});

app.view("GetEvent", async ({ ack, body, view, client }) => {
  await ack();
  const selectedDate = view["state"]["values"]["input"]["datepicker"]["selected_date"];
  const meetingRoom = view["state"]["values"]["meetingRoom"]["meetingRoom"]["selected_option"]["value"];

  const allEventList = await googleCalendar.getEvents(
    selectedDate + "T00:00:00",
    selectedDate + "T23:59:59",
    meetingRoom
  );

  let jsonBlocks = [];
  for (const [roomTitle, eventList] of Object.entries(allEventList)) {
    jsonBlocks.push({
      type: "divider",
    });
    jsonBlocks.push({
      type: "context",
      elements: [
        {
          type: "plain_text",
          text: meetingRoomTitle[roomTitle],
          emoji: false,
        },
      ],
    });
    jsonBlocks.push({
      type: "divider",
    });

    for (const [key, event] of Object.entries(eventList)) {
      if (!event.summary) continue;
      jsonBlocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*" + event.summary + "*",
        },
      });
      jsonBlocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: event.start.dateTime.split("T")[1].split("+")[0].slice(0, 5) +
          "-" +
          event.end.dateTime.split("T")[1].split("+")[0].slice(0, 5),
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            emoji: true,
            text: "예약 취소"
          },
          value: event['id'] + "||" + roomTitle,
          action_id: "eventCancel",
        }
      });
    }
  }
  jsonBlocks = jsonBlocks.concat(blocks.Main);
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
  try {
    await app.start(process.env.PORT || 3000);
    console.log("⚡️ Bolt app is running!");
  } catch (error) {
    console.error(error);
  }
})();
