interface ConnectionDBEntry {
  connectionId: string;
  sourceIp: string;
  connectedAt: number;
  siteId: string;
}

interface Message {
  threadId?: string;
  msgTimestamp: number;
  displayName: string;
  content: string;
  flags: string[];
  userId: string;
}

interface MessageDBEntry extends Message {
  sourceIp: string;
  siteId: string;
}

export { ConnectionDBEntry, Message, MessageDBEntry };
