import { SNSEvent } from "aws-lambda";
import { alarmHandler } from "../src/services/monitor/alarmHandler";

const snsEvent: SNSEvent = {
  Records: [
    {
      Sns: {
        Message: "This is a sample test message",
      },
    },
  ],
} as any;

alarmHandler(snsEvent, {});
