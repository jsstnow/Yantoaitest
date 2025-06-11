
export enum MessageSender {
  USER = 'USER',
  AI = 'AI',
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: MessageSender;
  isStreaming?: boolean;
  timestamp: number;
}
