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
    title,
    status: "OPEN",
    createdAt: now.toISOString(),
  };

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = createAuction;
