import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: Date;
}

const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-500",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 shadow-[var(--shadow-message)] transition-[var(--transition-smooth)]",
          isUser
            ? "bg-[hsl(var(--chat-user-bg))] text-[hsl(var(--chat-user-fg))] rounded-br-md"
            : "bg-[hsl(var(--chat-ai-bg))] text-[hsl(var(--chat-ai-fg))] border border-border rounded-bl-md"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message}
        </p>
        {timestamp && (
          <span className="text-xs opacity-60 mt-1 block">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
