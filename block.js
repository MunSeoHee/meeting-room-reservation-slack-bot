const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;
const date = now.getDate();
const hours = String(now.getHours()).padStart(2, "0");
const minutes = String(now.getMinutes()).padStart(2, "0");

module.exports = {
  CalendarInsertModal: [
    {
      type: "input",
      block_id: "meetingRoom",
      element: {
        type: "static_select",
        placeholder: {
          type: "plain_text",
          text: "Select an item",
          emoji: true,
        },
        action_id: "meetingRoom",
        options: [
          {
            text: {
              type: "plain_text",
              text: "3층 대회의실 (10인)",
              emoji: true,
            },
            value: "large",
          },
          {
            text: {
              type: "plain_text",
              text: "4층 중회의실 (6인)",
              emoji: true,
            },
            value: "medium",
          },
          {
            text: {
              type: "plain_text",
              text: "4층 소회의실 (4인)",
              emoji: true,
            },
            value: "small",
          },
        ],
      },
      label: {
        type: "plain_text",
        text: "회의실",
        emoji: true,
      },
    },
    {
			type: "input",
      block_id: "useReason",
			element: {
				type: "plain_text_input",
				action_id: "useReason"
			},
			label: {
				type: "plain_text",
				text: "사용 사유",
				emoji: true
			}
		},
    {
      type: "input",
      block_id: "multiUserSelect",
      element: {
        type: "multi_users_select",
        placeholder: {
          type: "plain_text",
          text: "Select users",
          emoji: true,
        },
        action_id: "multiUserSelect",
      },
      label: {
        type: "plain_text",
        text: "참석 인원",
        emoji: true,
      },
    },
    {
      type: "input",
      block_id: "Date",
      element: {
        type: "datepicker",
        initial_date: year + "-" + month + "-" + date,
        placeholder: {
          type: "plain_text",
          text: "Select a date",
          emoji: true,
        },
        action_id: "Date",
      },
      label: {
        type: "plain_text",
        text: "사용 일시",
        emoji: true,
      },
    },
    {
      type: "input",
      block_id: "StartTime",
      element: {
        type: "timepicker",
        initial_time: hours + ":" + minutes,
        placeholder: {
          type: "plain_text",
          text: "Select time",
          emoji: true,
        },
        action_id: "StartTime",
      },
      label: {
        type: "plain_text",
        text: "시작 시간",
        emoji: true,
      },
    },
    {
      type: "input",
      block_id: "EndTime",
      element: {
        type: "timepicker",
        initial_time: hours + ":" + minutes,
        placeholder: {
          type: "plain_text",
          text: "Select time",
          emoji: true,
        },
        action_id: "EndTime",
      },
      label: {
        type: "plain_text",
        text: "종료 시간",
        emoji: true,
      },
    },
  ],
  Main: [
    {
      type: "divider",
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "회의실 예약",
            emoji: false,
          },
          action_id: "viewInsertModal",
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "회의실 조회",
            emoji: false,
          },
          action_id: "viewGetModal",
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "예약 취소 및 수정",
            emoji: false,
          },
          action_id: "viewUpdateModal",
        },
      ],
    },
  ],
  CalendarGetModal: [
    {
      type: "input",
      block_id: "input",
      element: {
        type: "datepicker",
        initial_date: year + "-" + month + "-" + date,
        placeholder: {
          type: "plain_text",
          text: "Today",
          emoji: false,
        },
        action_id: "datepicker",
      },
      label: {
        type: "plain_text",
        text: "날짜를 선택해 주세요",
        emoji: false,
      },
    },
    {
      type: "input",
      block_id: "meetingRoom",
      element: {
        type: "static_select",
        placeholder: {
          type: "plain_text",
          text: "Select an item",
          emoji: true,
        },
        action_id: "meetingRoom",
        options: [
          {
            text: {
              type: "plain_text",
              text: "3층 대회의실 (10인)",
              emoji: true,
            },
            value: "large",
          },
          {
            text: {
              type: "plain_text",
              text: "4층 중회의실 (6인)",
              emoji: true,
            },
            value: "medium",
          },
          {
            text: {
              type: "plain_text",
              text: "4층 소회의실 (4인)",
              emoji: true,
            },
            value: "small",
          },
          {
            text: {
              type: "plain_text",
              text: "전체",
              emoji: true,
            },
            value: "all",
          },
        ],
      },
      label: {
        type: "plain_text",
        text: "회의실",
        emoji: true,
      },
    },
  ],
};
