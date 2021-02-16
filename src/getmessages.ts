import { queryTable } from './lib/dynamoDB';
import { postToConnections } from './lib/apiGateway';
import { Message } from './lib/types';

export async function handler(event) {
  const { connectionId } = event.requestContext;
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
    ['threadId', 'msgTimestamp', 'content', 'displayName', 'flags', 'userId'],
    messageQueryParams
  );
  const postData = {
    action: 'send',
    messages: previousMessages,
  };
  if (previousMessages.length > 0) {
    await postToConnections([connectionId], postData);
  }
  return { statusCode: 200, body: 'Messages sent.' };
}
