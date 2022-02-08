import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import createError from "http-errors";
import validator from "@middy/validator";
import commonMiddleware from "../middleware/commonMiddleware";
import createAuctionSchema from "../utils/schemas/createAuctionSchema";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const { title } = event.body;
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1); // Close Auction after 1 hour of the start date

  /**
   * Should not store any dynamic data in your global context of your
   * lambda functions. Lambda does not guarantee that you will always
   * hit the same instance, where the lambda is running and executed every
   * single time you call it. Storing dynamic data is not reliable.
   * Only store static data, if needed.
   */

  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0,
    },
  };

  try {
    await dynamodb
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction,
      })
      .promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(createAuction).use(
  validator({ inputSchema: createAuctionSchema })
);
