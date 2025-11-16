import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Loader2 } from "lucide-react";
import { MessageRole, type Message } from "@/types";

interface ChatContainerProps {
  messages: Message[];
  onSendMessage: (
    text: string,
    attachments?: Array<File>
  ) => void;
  isTyping?: boolean;
  onEditMessage?: (messageId: string, newText: string) => void;
  onDeleteMessage?: (messageId: string) => void;
}

const ChatContainer = ({
  messages,
  onSendMessage,
  isTyping = false,
  onEditMessage,
  onDeleteMessage,
}: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground text-center">
                Start a conversation by typing a message below
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.content}
                  isUser={message.role === MessageRole.user}
                  timestamp={message.timeStamp}
                  attachments={message.files}
                  onEdit={
                    onEditMessage
                      ? (newText) => onEditMessage(message.id, newText)
                      : undefined
                  }
                  onDelete={
                    onDeleteMessage
                      ? () => onDeleteMessage(message.id)
                      : undefined
                  }
                />
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[hsl(var(--chat-ai-bg))] border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-[var(--shadow-message)]">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm px-4 py-4 shrink-0">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSendMessage={onSendMessage} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
