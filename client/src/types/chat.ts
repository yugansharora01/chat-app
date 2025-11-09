export const MessageRole = {
  user: "user",
  assistant: "assistant",
} as const;
export type MessageRole = keyof typeof MessageRole;

export interface Message {
  id: string;
  userId: string;
  role: MessageRole;
  content: string;
  timeStamp: string;
  isTemporary?: boolean;
  attachments?: Array<{ name: string; url: string; size: number }>;
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
