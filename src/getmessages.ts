import { queryTable } from './lib/dynamoDB';
import { postToConnections } from './lib/apiGateway';
import { Message } from './types';

export async function handler(event) {
  const { connectionId, domainName, stage } = event.requestContext;
  const body = JSON.parse(event.body);
  const { siteId } = body;

  const messageQueryParams = {
    KeyConditionExpression: 'siteId = :id',
    ExpressionAttributeValues: {
      ':id': siteId,
    },
  };
  const previousMessages: Message[] = await queryTable(
    process.env.MSG_TABLE,
    ['threadId', 'msgTimestamp', 'content', 'displayName'],
    messageQueryParams
  );
  const endpoint = `${domainName}/${stage}`;
  if (previousMessages.length > 0) {
    await postToConnections(endpoint, [connectionId], previousMessages);
  }
  return { statusCode: 200, body: 'Messages sent.' };
}
