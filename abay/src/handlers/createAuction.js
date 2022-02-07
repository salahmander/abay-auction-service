import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";

const dyanmodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const { title } = JSON.parse(event.body);
  const now = new Date();

  /**
   * Should not store any dynamic data in your global context of your
   * lambda functions. Lambda does not guarantee that you will always
   * hit the same instance, where the lambda is running and executed every
   * single time you call it. Storing dynamic data up there is not reliable.
   * Only store static data, if needed.
   */
  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createdAt: now.toISOString(),
  };

  await dyanmodb
    .put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction,
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = createAuction;
