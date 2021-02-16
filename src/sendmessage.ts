import { putItem, queryTable } from './lib/dynamoDB';
import { postToConnections } from './lib/apiGateway';
import { createHash } from './utils/hash';
import { Message, MessageDBEntry } from './lib/types';

export async function handler(event) {
  const {
    connectionId,
    identity: { sourceIp },
  } = event.requestContext;
  console.dir(event);
  const body = JSON.parse(event.body);
  const { siteId } = body;
  const message: Message = {
    ...body.message,
    msgTimestamp: Date.now(),
  };
  if (!message.threadId)
    message.threadId = createHash(sourceIp + message.msgTimestamp);

  message.userId = createHash(sourceIp);

  const blockedUserQuery = {
    KeyConditionExpression: 'userId = :id',
    ExpressionAttributeValues: {
      ':id': message.userId,
    },
  };
  const blockedUserMatches = await queryTable(
    process.env.BLOCKED_TABLE,
    ['userId'],
    blockedUserQuery,
  );
  if (blockedUserMatches.length > 0) {
    const postData = {
      action: 'block',
    };
    await postToConnections([connectionId], postData);
    return { statusCode: 200, body: 'User is blocked, message rejected' };
  }

  const dbEntry: MessageDBEntry = {
    ...message,
    sourceIp,
    siteId,
  };

  const connectionQuery = {
    IndexName: 'siteIndex',
    KeyConditionExpression: 'siteId = :id',
    ExpressionAttributeValues: {
      ':id': siteId,
    },
  };

  const connections = await queryTable(
    process.env.CONN_TABLE,
    ['connectionId'],
    connectionQuery
  );
  const connectionIds = connections.map(({ connectionId }) => connectionId);
  const postData = {
    action: 'send',
    messages: [message],
  };
  try {
    await Promise.all([
      postToConnections(connectionIds, postData),
      putItem(process.env.MSG_TABLE, dbEntry),
    ]);
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify(e) };
  }

  return { statusCode: 200, body: 'Message sent.' };
}
