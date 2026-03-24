import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";
import { DynamoDBClient, ScanCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb";

const dynamo = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
  const endpoint = process.env.WEBSOCKET_ENDPOINT;
  const apigw = new ApiGatewayManagementApiClient({ endpoint });

  for (const record of event.Records) {
    if (record.eventName === "INSERT" || record.eventName === "MODIFY") {
      const newScore = unmarshall(record.dynamodb.NewImage);

      const connections = await dynamo.send(new ScanCommand({
        TableName: "Connections",
      }));

      for (const conn of connections.Items.map(unmarshall)) {
        try {
          await apigw.send(new PostToConnectionCommand({
            ConnectionId: conn.connectionId,
            Data: JSON.stringify({ type: "scoreUpdate", data: newScore }),
          }));
        } catch (err) {
          if (err.statusCode === 410) {
            await dynamo.send(new DeleteItemCommand({
              TableName: "Connections",
              Key: marshall({ connectionId: conn.connectionId }),
            }));
          }
        }
      }
    }
  }

  return { statusCode: 200, body: "Broadcast complete" };
};
