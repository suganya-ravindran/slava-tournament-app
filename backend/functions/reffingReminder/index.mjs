import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynamo = new DynamoDBClient({ region: "us-east-1" });
const sns = new SNSClient({ region: "us-east-1" });
const ses = new SESClient({ region: "us-east-1" });

export const handler = async () => {
  const now = new Date();
  const in20Min = new Date(now.getTime() + 20 * 60000).toISOString();

  const result = await dynamo.send(new ScanCommand({
    TableName: "ReffingSchedule",
    FilterExpression: "matchTime <= :in20 AND matchTime >= :now",
    ExpressionAttributeValues: {
      ":in20": { S: in20Min },
      ":now": { S: now.toISOString() },
    },
  }));

  const duties = result.Items.map(unmarshall);

  for (const duty of duties) {
    if (duty.coachPhone) {
      await sns.send(new PublishCommand({
        Message: `SLAVA Reminder: Your team refs ${duty.poolName} at ${duty.gym} at ${duty.matchTime}`,
        PhoneNumber: duty.coachPhone,
      }));
    }

    if (duty.coachEmail) {
      await ses.send(new SendEmailCommand({
        Source: "noreply@slava.com",
        Destination: { ToAddresses: [duty.coachEmail] },
        Message: {
          Subject: { Data: `SLAVA Reffing Reminder — ${duty.matchTime}` },
          Body: { Text: { Data: `Your team is assigned to referee ${duty.poolName} at ${duty.gym} at ${duty.matchTime}.` } },
        },
      }));
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: `${duties.length} reminders sent!` }),
  };
};
