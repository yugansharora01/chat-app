export const MessageRole = {
  USER: "USER",
  AI: "AI",
} as const;
export type MessageRole = keyof typeof MessageRole;

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

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  is_temporary?: boolean;
  created_at: string;
}
