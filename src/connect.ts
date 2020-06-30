import { parse } from 'url';
import { putItem } from './lib/dynamoDB';
import { ConnectionDBEntry } from './types';

export async function handler(event) {
  const {
    headers: { origin },
    queryStringParameters: { siteId },
    requestContext: {
      connectionId,
      connectedAt,
      identity: { sourceIp },
    },
  } = event;

  // const { hostname } = parse(origin);
  // if (hostname.toLowerCase() !== 'odileeds.org')
  //   return {
  //     statusCode: 403,
  //     body: 'This service is only available on the ODI Leeds website.',
  //   };
  
  const connectionData: ConnectionDBEntry = {
    connectionId,
    sourceIp,
    connectedAt,
    siteId,
  };

  try {
    await putItem(process.env.CONN_TABLE, connectionData);
  } catch (e) {
    return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(e) };
  }
  return { statusCode: 200, body: 'Connected.' };
}
