import { deleteItem, queryTable } from './lib/dynamoDB';
import { postToConnections } from './lib/apiGateway';
import { Message } from './lib/types';

export async function handler(event) {
  const { siteId, msg }: { siteId: string; msg: Message } = event;
  const connectionsQuery = {
    IndexName: 'siteIndex',
    KeyConditionExpression: 'siteId = :id',
    ExpressionAttributeValues: {
      ':id': siteId,
    },
  };
  const connections = await queryTable(
    process.env.CONN_TABLE,
    ['connectionId'],
    connectionsQuery
  );
  const connectionIds: string[] = connections.map(
    ({ connectionId }) => connectionId
  );
  const msgKey = {
    siteId,
    msgTimestamp: msg.msgTimestamp,
  };
  const postData = {
    action: 'delete',
    messages: [msg],
  };
  return await Promise.all([
    postToConnections(connectionIds, postData),
    deleteItem(process.env.MSG_TABLE, msgKey),
  ]);
}
