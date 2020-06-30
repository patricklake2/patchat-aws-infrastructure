import { deleteItem } from './lib/dynamoDB';

export async function handler(event) {
  const { connectionId } = event.requestContext;

  try {
    await deleteItem(process.env.CONN_TABLE, { connectionId });
  } catch (err) {
    return {
      statusCode: 500,
      body: 'Failed to delete connection: ' + JSON.stringify(err),
    };
  }

  return { statusCode: 200, body: 'Disconnected.' };
}
