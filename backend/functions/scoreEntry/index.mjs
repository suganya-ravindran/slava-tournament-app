import { DynamoDBClient, PutItemCommand, ScanCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
  const method = event.httpMethod;

  if (method === "GET") {
    const result = await client.send(new ScanCommand({ TableName: "Scores" }));
    return { statusCode: 200, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify(result.Items.map(unmarshall)) };
  }

  if (method === "POST") {
    const body = JSON.parse(event.body);
    await client.send(new PutItemCommand({ TableName: "Scores", Item: marshall({ ...body, updatedAt: new Date().toISOString() }) }));
    return { statusCode: 200, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ message: "Score saved!", matchId: body.matchId }) };
  }

  if (method === "DELETE") {
    const { matchId, poolId } = JSON.parse(event.body);
    await client.send(new DeleteItemCommand({ TableName: "Scores", Key: marshall({ matchId, poolId }) }));
    return { statusCode: 200, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ message: "Score deleted!" }) };
  }
};
