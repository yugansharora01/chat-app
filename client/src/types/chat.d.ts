export enum MessageRole {
  USER = "USER",
  AI = "AI",
}

export interface Message {
  id: string;
  userId: string;
  role: MessageRole;
  content: string;
  timeStamp: string;
}

export interface ChatResponse {
  messages: Message[];
  meta: Record<string, any>;
}
