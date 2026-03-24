import { DynamoDBClient, QueryCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
  const { tournamentId } = JSON.parse(event.body);

  const result = await client.send(new QueryCommand({
    TableName: "Scores",
    IndexName: "tournamentId-index",
    KeyConditionExpression: "tournamentId = :tid",
    ExpressionAttributeValues: { ":tid": { S: tournamentId } },
  }));

  const scores = result.Items.map(unmarshall);
  const rankings = rankTeams(scores);
  const bracketId = `bracket-${tournamentId}`;

  await client.send(new PutItemCommand({
    TableName: "Brackets",
    Item: marshall({ bracketId, tournamentId, rankings, createdAt: new Date().toISOString() }),
  }));

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ message: "Bracket seeded!", bracketId, rankings }),
  };
};

function rankTeams(scores) {
  const teams = {};
  scores.forEach(match => {
    const t1 = match.team1Id; const t2 = match.team2Id;
    if (!teams[t1]) teams[t1] = { teamId: t1, wins: 0, losses: 0, pointDiff: 0 };
    if (!teams[t2]) teams[t2] = { teamId: t2, wins: 0, losses: 0, pointDiff: 0 };
    if (match.team1Score > match.team2Score) {
      teams[t1].wins++; teams[t2].losses++;
    } else {
      teams[t2].wins++; teams[t1].losses++;
    }
    teams[t1].pointDiff += (match.team1Score - match.team2Score);
    teams[t2].pointDiff += (match.team2Score - match.team1Score);
  });
  return Object.values(teams)
    .sort((a, b) => b.wins - a.wins || b.pointDiff - a.pointDiff);
}
