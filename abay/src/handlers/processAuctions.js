import createError from "http-errors";
import { getEndedAuctions } from "../utils/getEndedAuctions";
import { closeAuction } from "../utils/closeAuction";

// Close auctions in parallel, so that it closes all the required ones at the same time
async function processAuctions(event, context) {
  try {
    const auctionsToClose = await getEndedAuctions();
    const closePromises = auctionsToClose.map((auction) =>
      closeAuction(auction)
    );
    await Promise.all(closePromises);
    return { closed: closePromises.length };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}

export const handler = processAuctions;
