import ApiGatewayManagementApi from 'aws-sdk/clients/apigatewaymanagementapi';
import { deleteItem } from './dynamoDB';
import { Message } from './types';

const apiGateway = new ApiGatewayManagementApi({
  apiVersion: '2018-11-29',
  endpoint: process.env.API_ENDPOINT,
});

export async function postToConnections(
  connectionIds: string[],
  data: { action: string, messages?: Message[]}
): Promise<void[]> {
  return await Promise.all(
    connectionIds.map(
      async (connectionId: string): Promise<void> => {
        try {
          await apiGateway
            .postToConnection({
              ConnectionId: connectionId,
              Data: JSON.stringify(data),
            })
            .promise();
        } catch (e) {
          if (e.statusCode === 410) {
            console.log(`Found stale connection, deleting ${connectionId}`);
            await deleteItem(process.env.CONN_TABLE, { connectionId });
          } else {
            throw e;
          }
        }
      }
    )
  );
}
