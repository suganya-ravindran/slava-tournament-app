import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
  const poolId = event.pathParameters?.poolId;

  const result = await client.send(new QueryCommand({
    TableName: "Scores",
    KeyConditionExpression: "poolId = :poolId",
    ExpressionAttributeValues: { ":poolId": { S: poolId } },
  }));

  const scores = result.Items.map(unmarshall);
  const standings = calculateStandings(scores);

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(standings),
  };
};

function calculateStandings(scores) {
  const teams = {};
  scores.forEach(match => {
    const t1 = match.team1Id; const t2 = match.team2Id;
    if (!teams[t1]) teams[t1] = { wins: 0, losses: 0, pointDiff: 0 };
    if (!teams[t2]) teams[t2] = { wins: 0, losses: 0, pointDiff: 0 };
    if (match.team1Score > match.team2Score) {
      teams[t1].wins++; teams[t2].losses++;
    } else {
      teams[t2].wins++; teams[t1].losses++;
    }
    teams[t1].pointDiff += (match.team1Score - match.team2Score);
    teams[t2].pointDiff += (match.team2Score - match.team1Score);
  });
  return Object.entries(teams)
    .sort((a, b) => b[1].wins - a[1].wins || b[1].pointDiff - a[1].pointDiff)
    .map(([teamId, stats]) => ({ teamId, ...stats }));
}
