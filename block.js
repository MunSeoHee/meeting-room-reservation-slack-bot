const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;
const date = now.getDate();

module.exports = {
    CalendarInsertModal : [
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
    Main : [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "회의실 도우미"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "회의실 예약",
						"emoji": false
					},
					"action_id": "viewInsertModal"
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "회의실 조회",
						"emoji": false
					},
					"action_id": "viewGetModal"
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "예약 취소 및 수정",
						"emoji": false
					},
					"action_id": "viewUpdateModal"
				}
			]
		}
	],
    CalendarGetModal : [
		{
			"type": "input",
            "block_id": "input",
			"element": {
				"type": "datepicker",
				"initial_date": year + "-" + month + "-" + date,
				"placeholder": {
					"type": "plain_text",
					"text": "Today",
					"emoji": false
				},
				"action_id": "datepicker"
			},
			"label": {
				"type": "plain_text",
				"text": "날짜를 선택해 주세요",
				"emoji": false
			}
		}
	],
}