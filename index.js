const { App } = require('@slack/bolt');
require("dotenv").config();

const app = new App({
  token: process.env.TOKEN,
  signingSecret: process.env.SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
});

app.message('hello', async ({ message, say }) => {
  await say({
    text: `☀️ Good Morning`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `☀️ Good Morning`,
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "오늘의 문제",
          },
          action_id: "morning_button",
        },
      },
    ],
  });
});
app.action("morning_button", async ({ body, ack, say, client }) => {
    await ack();
    try {
      const result = await client.views.open({
        trigger_id: body.trigger_id,
        view: {
          type: "modal",
          callback_id: "morning_modal",
          title: {
            type: "plain_text",
            text: "미라클 모닝 챌린지",
          },
          blocks: [
            {
                "type": "input",
                "element": {
                    "type": "static_select",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select an item",
                        "emoji": true
                    },
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "*this is plain_text text*",
                                "emoji": true
                            },
                            "value": "value-0"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "*this is plain_text text*",
                                "emoji": true
                            },
                            "value": "value-1"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "*this is plain_text text*",
                                "emoji": true
                            },
                            "value": "value-2"
                        }
                    ],
                    "action_id": "static_select-action"
                },
                "label": {
                    "type": "plain_text",
                    "text": "회의실",
                    "emoji": true
                }
            },
            {
                "type": "input",
                "element": {
                    "type": "multi_users_select",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select users",
                        "emoji": true
                    },
                    "action_id": "multi_users_select-action"
                },
                "label": {
                    "type": "plain_text",
                    "text": "참석 인원",
                    "emoji": true
                }
            },
            {
                "type": "input",
                "element": {
                    "type": "datepicker",
                    "initial_date": "1990-04-28",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select a date",
                        "emoji": true
                    },
                    "action_id": "datepicker-action"
                },
                "label": {
                    "type": "plain_text",
                    "text": "사용 일시",
                    "emoji": true
                }
            },
            {
                "type": "input",
                "element": {
                    "type": "timepicker",
                    "initial_time": "13:37",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select time",
                        "emoji": true
                    },
                    "action_id": "timepicker-action"
                },
                "label": {
                    "type": "plain_text",
                    "text": "시작 시간",
                    "emoji": true
                }
            },
            {
                "type": "input",
                "element": {
                    "type": "timepicker",
                    "initial_time": "13:37",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select time",
                        "emoji": true
                    },
                    "action_id": "timepicker-action"
                },
                "label": {
                    "type": "plain_text",
                    "text": "종료 시간",
                    "emoji": true
                }
            }
        ],
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

app.view("morning_modal", async ({ ack, body, view, client}) => {
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

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
