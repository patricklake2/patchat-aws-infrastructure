import { putItem, deleteItem } from './lib/dynamoDB';

enum actions {
  BLOCK = 'block',
  UNBLOCK = 'unblock',
}

export async function handler(event) {
  const { action, userId }: { action: actions, userId: string } = event;

  if(action === actions.BLOCK) {
    return await putItem(process.env.BLOCKED_TABLE, { userId });
  }
  else if (action === actions.UNBLOCK) {
    return await deleteItem(process.env.BLOCKED_TABLE, { userId });
  }
  else throw new Error(`Unknown action: '${action}'`)
}
