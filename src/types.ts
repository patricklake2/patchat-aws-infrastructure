interface ConnectionDBEntry {
  connectionId: string;
  sourceIp: string;
  connectedAt: number;
  siteUrl: string,
}

interface Message {
  threadId?: string;
  msgTimestamp: number;
  displayName: string;
  content: string;
}

interface MessageDBEntry extends Message {
  sourceIp: string;
  siteUrl: string;
}

export { ConnectionDBEntry, Message, MessageDBEntry };
