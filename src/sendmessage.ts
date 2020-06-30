import { putItem, queryTable } from './lib/dynamoDB';
import { postToConnections } from './lib/apiGateway';
import { createHash } from './utils/hash';
import { Message, MessageDBEntry } from './types';

export async function handler(event) {
  const {
    domainName,
    stage,
    identity: { sourceIp },
  } = event.requestContext;
  console.dir(event);
  const body = JSON.parse(event.body);
  const { siteUrl } = event.body;
  const message: Message = {
    ...body.message,
    msgTimestamp: Date.now(),
  };
  if (!message.threadId)
    message.threadId = createHash(sourceIp + message.msgTimestamp);
  
  const dbEntry: MessageDBEntry = {
    ...message,
    sourceIp,
    siteUrl,
  }

  const connectionQuery = {
    KeyConditionExpression: 'siteUrl = :url',
    ExpressionAttributeValues: {
      ':url': siteUrl,
    },
  }

  const connections = await queryTable(process.env.MSG_TABLE, ['connectionId'], connectionQuery)
  const connectionIds = connections.map(({ connectionId }) => connectionId )
  const apiEndpoint = `${domainName}/${stage}`;

  try {
    await Promise.all([
      postToConnections(apiEndpoint, connectionIds, [message]),
      putItem(process.env.MSG_TABLE, dbEntry),
    ]);
  } catch(e) {
    return { statusCode: 500, body: JSON.stringify(e) };
  }

  return { statusCode: 200, body: 'Message sent.' };
}
