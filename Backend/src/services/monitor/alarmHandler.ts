import { SNSEvent } from "aws-lambda";
import * as path from "path";
import * as dotenv from "dotenv";

// Setting up dotenv file path
dotenv.config({ path: path.join(__dirname, "../../../.env") });

console.log(process.env.AWS_ALARM_SLACK_WEBHOOK_URL);
const slackWebHookUrl = process.env.AWS_ALARM_SLACK_WEBHOOK_URL;

async function alarmHandler(event: SNSEvent, context) {
  for (const record of event.Records) {
    const response = await fetch(slackWebHookUrl, {
      method: "POST",
      body: JSON.stringify({
        text: `Karthik, we have a problem: ${record.Sns.Message}`,
      }),
    });
    console.log(await response);
  }
}

export { alarmHandler };
